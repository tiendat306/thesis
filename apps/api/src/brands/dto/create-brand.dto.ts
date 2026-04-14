import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateBrandDto {
  @ApiProperty({ description: 'Tên thương hiệu' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mô tả chi tiết', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Trạng thái hoạt động', required: false, default: true })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Logo API', required: false })
  @IsOptional()
  file?: any;
}
