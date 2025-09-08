import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileService } from 'src/file/file.service';
import { BestsellerEntity } from './entities/bestseller.entity';
import { CreateBestsellerDto } from './dto/create-bestseller.dto';
import { UpdateBestsellerDto } from './dto/update-bestseller.dto';
import { CategoryEntity } from 'src/categories/entities/category.entity';

@Injectable()
export class BestsellersService {
  constructor(
    @InjectRepository(BestsellerEntity)
    private readonly bestsellerRepo: Repository<BestsellerEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    private readonly fileService: FileService,
  ) {}

  async create(
    createBestsellerDto: CreateBestsellerDto,
    files: Express.Multer.File | any,
  ) {
    try {
      let photos: string[] = [];
      if (files) {
        for (const file of files) {
          const photo = await this.fileService.createFile(file);
          photos.push(photo);
        }
      }
      const bestseller = this.bestsellerRepo.create({
        ...createBestsellerDto,
        images: photos,
      });
      const savedBestseller = await this.bestsellerRepo.save(bestseller);
      return {
        statusCode: 201,
        message: 'success',
        data: savedBestseller,
      };
    } catch (error) {
      throw new BadRequestException('Error on creating bestseller: ' + error);
    }
  }

  async findAll(category?: string) {
    try {
      let bestsellers;
      if (category) {
        const categoryEntity = await this.categoryRepo.findOne({
          where: { name: category }
        });
  
        if (!categoryEntity) return { statusCode: 200, message: 'success', data: [] };
  
        bestsellers = await this.bestsellerRepo.find({
          where: { category: categoryEntity },
        });
      } else {
        bestsellers = await this.bestsellerRepo.find();
      }
  
      return {
        statusCode: 200,
        message: 'success',
        data: bestsellers,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
   

  async findOne(id: number) {
    const bestseller = await this.bestsellerRepo.findOne({
      where: { id },
    });
    if (!bestseller) {
      throw new NotFoundException('bestseller not found');
    }

    return {
      status_code: 200,
      message: 'success',
      data: bestseller,
    };
  }

  async update(
    id: number,
    updateBestsellerDto: UpdateBestsellerDto,
    files: Express.Multer.File | any,
  ) {
    try {
      const bestseller = await this.bestsellerRepo.findOne({
        where: { id },
      });
      if (!bestseller) {
        throw new NotFoundException('bestseller not found');
      }

      let photos = bestseller.images || [];
      if (files && files.length > 0) {
        for (const img of photos) {
          if (await this.fileService.existFile(img)) {
            await this.fileService.deleteFile(img);
          }
        }

        photos = [];
        for (const file of files) {
          const photo = await this.fileService.createFile(file);
          photos.push(photo);
        }
      }
      await this.bestsellerRepo.update(id, {
        ...updateBestsellerDto,
        images: photos,
      });
      const updatedBestseller = await this.bestsellerRepo.findOne({
        where: { id },
      });
      return {
        status_code: 200,
        message: 'success',
        data: updatedBestseller,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: number) {
    const data = await this.bestsellerRepo.findOneBy({ id });
    if (!data) {
      throw new NotFoundException('bestseller not found');
    }
    try {
      await this.bestsellerRepo.delete(id);
      if (data.images && data.images.length > 0) {
        for (const img of data.images) {
          if (await this.fileService.existFile(img)) {
            await this.fileService.deleteFile(img);
          }
        }
      }
    } catch (error) {
      throw new BadRequestException(`Error on deleting bestseller: ${error}`);
    }
    return {
      status_code: 200,
      message: 'success',
      data: {},
    };
  }
}
