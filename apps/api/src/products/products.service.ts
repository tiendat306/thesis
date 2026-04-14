import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateProductStatusDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import slugify from 'slugify';
import { Prisma, ProductStatus } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProductImagesOrderDto } from './dto/product-image.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const slug = createProductDto.slug || slugify(createProductDto.name, { lower: true, strict: true });

    // Check slug
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) {
      throw new BadRequestException('Product slug already exists');
    }

    // Verify brand and category
    const brand = await this.prisma.brand.findUnique({ where: { id: createProductDto.brandId } });
    if (!brand) throw new BadRequestException('Brand not found');
    const category = await this.prisma.category.findUnique({ where: { id: createProductDto.categoryId } });
    if (!category) throw new BadRequestException('Category not found');

    // Calculate basePrice (min price among all variants)
    let basePrice: number | undefined;
    createProductDto.colors.forEach(color => {
      color.variants.forEach(variant => {
        if (basePrice === undefined || variant.price < basePrice) {
          basePrice = variant.price;
        }
      });
    });

    if (basePrice === undefined) {
      throw new BadRequestException('At least one variant must be provided to calculate basePrice');
    }

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: createProductDto.name,
          slug,
          description: createProductDto.description,
          brandId: createProductDto.brandId,
          categoryId: createProductDto.categoryId,
          basePrice: basePrice!,
          status: createProductDto.status || ProductStatus.DRAFT,
          isFeatured: createProductDto.isFeatured || false,
        },
      });

      for (const color of createProductDto.colors) {
        await tx.productColor.create({
          data: {
            productId: product.id,
            name: color.name,
            colorCode: color.colorCode,
            variants: {
              create: color.variants.map((v) => ({
                productId: product.id,
                size: v.size,
                sku: v.sku,
                price: v.price,
                compareAtPrice: v.compareAtPrice,
                stock: v.stock,
              })),
            },
          },
        });
      }

      return tx.product.findUniqueOrThrow({
        where: { id: product.id },
        include: {
          colors: {
            include: {
              variants: true,
            },
          },
        },
      });
    });
  }

  async findAll(filter: ProductFilterDto, isAdmin: boolean = false) {
    const { search, categoryId, brandId, status, minPrice, maxPrice, limit = 20, page = 1 } = filter;

    const where: Prisma.ProductWhereInput = {};

    if (!isAdmin) {
      // Public user only sees ACTIVE products
      where.status = ProductStatus.ACTIVE;
    } else if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) where.basePrice.gte = minPrice;
      if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          brand: true,
          category: true,
          colors: {
            include: { images: true }
          }
        }
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(identifier: string) {
    // identifier can be ID or slug
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ]
      },
      include: {
        brand: true,
        category: true,
        colors: {
          include: {
            variants: true,
            images: true,
          }
        }
      }
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateStatus(id: string, updateProductStatusDto: UpdateProductStatusDto) {
    const product = await this.findOne(id); // Check existence
    return this.prisma.product.update({
      where: { id: product.id },
      data: { status: updateProductStatusDto.status }
    });
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return this.prisma.product.delete({ where: { id: product.id } });
  }

  // Gallery Management
  async addImagesToColor(colorId: string, files: Express.Multer.File[]) {
    const color = await this.prisma.productColor.findUnique({
      where: { id: colorId },
      include: { images: { orderBy: { sortOrder: 'desc' }, take: 1 } },
    });
    if (!color) throw new NotFoundException('Product color not found');

    const lastSortOrder = color.images[0]?.sortOrder ?? -1;

    const uploadedImages: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const uploadResult = await this.cloudinary.uploadFile(files[i], 'thesis/products');
      const image = await this.prisma.productImage.create({
        data: {
          colorId,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          sortOrder: lastSortOrder + 1 + i,
        },
      });
      uploadedImages.push(image);
    }
    return uploadedImages;
  }

  async removeImage(imageId: string) {
    const image = await this.prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) throw new NotFoundException('Image not found');

    if (image.publicId) {
      await this.cloudinary.deleteFile(image.publicId);
    }

    return this.prisma.productImage.delete({ where: { id: imageId } });
  }

  async updateImagesOrder(colorId: string, updateDto: UpdateProductImagesOrderDto) {
    const updates = updateDto.images.map((img) =>
      this.prisma.productImage.update({
        where: { id: img.id },
        data: { sortOrder: img.sortOrder },
      }),
    );
    await Promise.all(updates);
    return { success: true };
  }
}

