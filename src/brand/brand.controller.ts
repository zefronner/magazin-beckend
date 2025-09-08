import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBannerDto } from 'src/banner/dto/update-banner.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService:BrandService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile()
    photo?: Express.Multer.File | undefined | any
  ) {
    return this.brandService.create(createBrandDto, photo);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: number, 
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFile()
    photo?: Express.Multer.File | undefined | any 
  ) {
    return this.brandService.update(+id, updateBannerDto, photo);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.brandService.remove(+id);
  }
}
