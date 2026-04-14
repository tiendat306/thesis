import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsBoolean, IsNumber, Min, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';

export class CreateProductVariantDto {
  @ApiProperty({ description: 'Size sản phẩm (VD: 42, XL)' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ description: 'Mã SKU duy nhất', example: 'NK-AF1-WHT-42' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ description: 'Giá bán gốc' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Giá bán trước sale (nếu có)', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  compareAtPrice?: number;

  @ApiProperty({ description: 'Số lượng tồn kho', default: 0 })
  @IsNumber()
  @Min(0)
  stock: number;
}

export class CreateProductColorDto {
  @ApiProperty({ description: 'Tên màu sắc (VD: White)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mã HEX màu (VD: #FFFFFF)', required: false })
  @IsString()
  @IsOptional()
  colorCode?: string;

  @ApiProperty({ type: [CreateProductVariantDto], description: 'Danh sách các biến thể của màu' })
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  @ArrayMinSize(1)
  variants: CreateProductVariantDto[];
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ description: 'ID của Brand' })
  @IsUUID()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({ description: 'ID của Category' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ enum: ProductStatus, default: ProductStatus.DRAFT, required: false })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ type: [CreateProductColorDto], description: 'Danh sách các màu và biến thể tương ứng' })
  @ValidateNested({ each: true })
  @Type(() => CreateProductColorDto)
  @ArrayMinSize(1)
  colors: CreateProductColorDto[];
}
