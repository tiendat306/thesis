import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductImageOrderDto {
  @ApiProperty({ description: 'ID của ảnh' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @IsNumber()
  sortOrder: number;
}

export class UpdateProductImagesOrderDto {
  @ApiProperty({ type: [UpdateProductImageOrderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductImageOrderDto)
  images: UpdateProductImageOrderDto[];
}

export class UploadImagesDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, description: 'Danh sách ảnh tải lên' })
  files: any[];
}
