import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductStatusDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.OWNER, RoleName.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo sản phẩm mới cùng lúc với màu sắc và biến thể (Admin)' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lọc và phân trang danh sách sản phẩm' })
  findAll(@Query() filter: ProductFilterDto, @Req() req: any) {
    // Determine if admin by checking authorization token manually or we can just offer an explicit admin endpoint.
    // For simplicity, we just assume public call here.
    return this.productsService.findAll(filter, false);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.OWNER, RoleName.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lọc sản phẩm (Dành cho Admin - thấy cả DRAFT)' })
  findAllAdmin(@Query() filter: ProductFilterDto) {
    return this.productsService.findAll(filter, true);
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Xem chi tiết sản phẩm qua ID hoặc Slug' })
  findOne(@Param('identifier') identifier: string) {
    return this.productsService.findOne(identifier);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.OWNER, RoleName.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật trạng thái sản phẩm' })
  updateStatus(@Param('id') id: string, @Body() updateProductStatusDto: UpdateProductStatusDto) {
    return this.productsService.updateStatus(id, updateProductStatusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

