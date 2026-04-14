import { 
  Controller, 
  Post, 
  Delete, 
  Patch, 
  Param, 
  Body, 
  UseGuards, 
  UseInterceptors, 
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UpdateProductImagesOrderDto, UploadImagesDto } from './dto/product-image.dto';

@ApiTags('Product Images')
@Controller('products')
export class ProductImagesController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('colors/:colorId/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.OWNER, RoleName.STAFF)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload nhiều ảnh cho màu sản phẩm' })
  @UseInterceptors(FilesInterceptor('files', 10)) // Giới hạn 10 ảnh
  uploadImages(
    @Param('colorId') colorId: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.productsService.addImagesToColor(colorId, files);
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.OWNER, RoleName.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa ảnh sản phẩm' })
  removeImage(@Param('imageId') imageId: string) {
    return this.productsService.removeImage(imageId);
  }

  @Patch('colors/:colorId/images/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.OWNER, RoleName.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sắp xếp lại thứ tự ảnh trong gallery' })
  reorderImages(
    @Param('colorId') colorId: string,
    @Body() updateDto: UpdateProductImagesOrderDto,
  ) {
    return this.productsService.updateImagesOrder(colorId, updateDto);
  }
}
