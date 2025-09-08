import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { FileService } from 'src/file/file.service';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(CategoryEntity) private readonly categoryRepo: Repository<CategoryEntity>,
    private readonly fileService: FileService
  ) {}

  async create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File | any) {
    try {
      let photo = '';
      if(file) {
        photo = await this.fileService.createFile(file);
      };
      const category = await this.categoryRepo.create({
        ...createCategoryDto,
        image : photo
      });
      const savedCategory = await this.categoryRepo.save(category);
      return {
        statusCode: 201,
        message: 'success',
        data: savedCategory
      }
    } catch (error) {
      throw new BadRequestException('Error on creating category: ' + error);
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepo.find();
      return {
        statusCode: 201,
        message: 'success',
        data: categories
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id }
    });
    if (!category) {
      throw new NotFoundException('category not found');
    }
  
    return {
      status_code: 200,
      message: 'success',
      data: category,
    };
    
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File | any ) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { id }
      });
      if (!category) {
        throw new NotFoundException('category not found');
      }

      let photo = category.image;
      if (file) {
        photo = await this.fileService.createFile(file);
      
        if (category.image && (await this.fileService.existFile(category.image))) {
          await this.fileService.deleteFile(category.image);
        }
      };
      await this.categoryRepo.update(id, {
        ...updateCategoryDto,
        image: photo
      });
      const updatedCategory = await this.categoryRepo.findOne({ where: { id } });
      return {
        status_code: 200,
        message: 'success',
        data: updatedCategory,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: number) {
    const data = await this.categoryRepo.findOneBy({id});
    if (!data) {
      throw new NotFoundException('category not found');
    }
    try {
      await this.categoryRepo.delete(id);
    } catch (error) {
      throw new BadRequestException(`Error on deleting category: ${error}`);
    };
    if (
      data.image &&
      (await this.fileService.existFile(data?.image))
    ) {
      await this.fileService.deleteFile(data?.image);
    }
    return {
      status_code: 200,
      message: 'success',
      data: {},
    };
  }
}
