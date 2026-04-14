import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import slugify from 'slugify';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, file?: Express.Multer.File) {
    const slug = slugify(createCategoryDto.name, { lower: true, strict: true });
    
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new BadRequestException('Category slug already exists');
    }

    if (createCategoryDto.parentId) {
      const parent = await this.prisma.category.findUnique({ where: { id: createCategoryDto.parentId } });
      if (!parent) throw new BadRequestException('Parent category not found');
    }

    let imageUrl: string | undefined = undefined;
    if (file) {
      const uploadResult = await this.cloudinary.uploadFile(file, 'thesis/categories');
      imageUrl = uploadResult.secure_url;
    }

    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        slug,
        image: imageUrl,
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        parent: true,
      }
    });
  }

  // Returns recursive category tree
  findTree() {
    return this.prisma.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: {
          include: {
            children: true, // go down 2 levels
          }
        }
      }
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ 
      where: { id },
      include: { parent: true, children: true }
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, file?: Express.Multer.File) {
    await this.findOne(id); // Ensure exists

    let slug: string | undefined = undefined;
    if (updateCategoryDto.name) {
      slug = slugify(updateCategoryDto.name, { lower: true, strict: true });
      const existing = await this.prisma.category.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) throw new BadRequestException('Category name already in use');
    }

    if (updateCategoryDto.parentId) {
      if (updateCategoryDto.parentId === id) throw new BadRequestException('Category cannot be its own parent');
      const parent = await this.prisma.category.findUnique({ where: { id: updateCategoryDto.parentId } });
      if (!parent) throw new BadRequestException('Parent category not found');
    }

    let imageUrl: string | undefined = undefined;
    if (file) {
      const uploadResult = await this.cloudinary.uploadFile(file, 'thesis/categories');
      imageUrl = uploadResult.secure_url;
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
        ...(slug && { slug }),
        ...(imageUrl && { image: imageUrl }),
      },
    });
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    if (category.children && category.children.length > 0) {
      throw new BadRequestException('Cannot delete category with children');
    }
    return this.prisma.category.delete({ where: { id } });
  }
}

