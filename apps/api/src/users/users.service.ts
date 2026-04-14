import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { RoleName } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async create(data: RegisterDto & { passwordHash: string }) {
    // Determine the CUSTOMER role
    let customerRole = await this.prisma.role.findUnique({
      where: { name: RoleName.CUSTOMER },
    });

    if (!customerRole) {
      // Auto-create CUSTOMER role if it doesn't exist
      customerRole = await this.prisma.role.create({
        data: { name: RoleName.CUSTOMER },
      });
    }

    try {
      return await this.prisma.user.create({
        data: {
          email: data.email,
          password: data.passwordHash,
          fullName: data.fullName,
          roleId: customerRole.id,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }
}
