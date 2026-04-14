import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import slugify from 'slugify';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class BrandsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(createBrandDto: CreateBrandDto, file?: Express.Multer.File) {
    const slug = slugify(createBrandDto.name, { lower: true, strict: true });
    
    const existing = await this.prisma.brand.findUnique({ where: { slug } });
    if (existing) {
      throw new BadRequestException('Brand name already exists');
    }

    let logoUrl = null;
    if (file) {
      const uploadResult = await this.cloudinary.uploadFile(file, 'thesis/brands');
      logoUrl = uploadResult.secure_url;
    }

    return this.prisma.brand.create({
      data: {
        ...createBrandDto,
        slug,
        logo: logoUrl,
      },
    });
  }

  findAll(isActiveOnly: boolean = false) {
    const where = isActiveOnly ? { isActive: true } : {};
    return this.prisma.brand.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto, file?: Express.Multer.File) {
    await this.findOne(id); // Ensure exists

    let slug: string | undefined = undefined;
    if (updateBrandDto.name) {
      slug = slugify(updateBrandDto.name, { lower: true, strict: true });
      const existing = await this.prisma.brand.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) throw new BadRequestException('Brand name already in use');
    }

    let logoUrl: string | undefined = undefined;
    if (file) {
      const uploadResult = await this.cloudinary.uploadFile(file, 'thesis/brands');
      logoUrl = uploadResult.secure_url;
    }

    return this.prisma.brand.update({
      where: { id },
      data: {
        ...updateBrandDto,
        ...(slug && { slug }),
        ...(logoUrl && { logo: logoUrl }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.brand.delete({ where: { id } });
  }
}

