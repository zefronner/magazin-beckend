import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BannerService } from './banner.service';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { CreateBannerDto } from './dto/create-banner.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService:BannerService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile()
    photo?: Express.Multer.File | undefined | any
  ) {
    return this.bannerService.create(createBannerDto, photo);
  }

  @Get()
  findAll() {
    return this.bannerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bannerService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: number, 
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFile()
    photo?: Express.Multer.File | undefined | any 
  ) {
    return this.bannerService.update(+id, updateBannerDto, photo);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bannerService.remove(+id);
  }
}
