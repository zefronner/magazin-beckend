import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile()
    photo?: Express.Multer.File | undefined | any
  ) {
    return this.categoriesService.create(createCategoryDto, photo);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: number, 
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile()
    photo?: Express.Multer.File | undefined | any 
  ) {
    return this.categoriesService.update(+id, updateCategoryDto, photo);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoriesService.remove(+id);
  }
}
