import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { BestsellersService } from './bestsellers.service';
import { CreateBestsellerDto } from './dto/create-bestseller.dto';
import { UpdateBestsellerDto } from './dto/update-bestseller.dto';

@Controller('bestsellers')
export class BestsellersController {
  constructor(private readonly bestsellersService:BestsellersService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() dto: CreateBestsellerDto,
    @UploadedFiles()
    files: Express.Multer.File[] | undefined | any
  ) {
    return this.bestsellersService.create(dto, files);
  };

  @Get()
  async findAll(@Query('category') category?: string) {
    return this.bestsellersService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bestsellersService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  update(
    @Param('id') id: number, 
    @Body() updateBestsellersDto: UpdateBestsellerDto,
    @UploadedFiles()
    files: Express.Multer.File[] | undefined | any 
  ) {
    return this.bestsellersService.update(+id, updateBestsellersDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bestsellersService.remove(+id);
  }
}
