import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileService } from 'src/file/file.service';
import { BrandEntity } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {

  constructor(
    @InjectRepository(BrandEntity) private readonly brandRepo: Repository<BrandEntity>,
    private readonly fileService: FileService
  ) {}

  async create(createBrandDto: CreateBrandDto, file: Express.Multer.File | any) {
    try {
      let photo = '';
      if(file) {
        photo = await this.fileService.createFile(file);
      };
      const brand = await this.brandRepo.create({
        ...createBrandDto,
        image : photo
      });
      const savedBrand = await this.brandRepo.save(brand);
      return {
        statusCode: 201,
        message: 'success',
        data: savedBrand
      }
    } catch (error) {
      throw new BadRequestException('Error on creating brand: ' + error);
    }
  }

  async findAll() {
    try {
      const brands = await this.brandRepo.find();
      return {
        statusCode: 201,
        message: 'success',
        data: brands
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number) {
    const brand = await this.brandRepo.findOne({
      where: { id }
    });
    if (!brand) {
      throw new NotFoundException('brand not found');
    }
  
    return {
      status_code: 200,
      message: 'success',
      data: brand,
    };
    
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, file: Express.Multer.File | any ) {
    try {
      const brand = await this.brandRepo.findOne({
        where: { id }
      });
      if (!brand) {
        throw new NotFoundException('brand not found');
      }

      let photo = brand.image;
      if (file) {
        photo = await this.fileService.createFile(file);
      
        if (brand.image && (await this.fileService.existFile(brand.image))) {
          await this.fileService.deleteFile(brand.image);
        }
      };
      await this.brandRepo.update(id, {
        ...updateBrandDto,
        image: photo
      });
      const updatedBrand = await this.brandRepo.findOne({ where: { id } });
      return {
        status_code: 200,
        message: 'success',
        data: updatedBrand,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: number) {
    const data = await this.brandRepo.findOneBy({id});
    if (!data) {
      throw new NotFoundException('brand not found');
    }
    try {
      await this.brandRepo.delete(id);
    } catch (error) {
      throw new BadRequestException(`Error on deleting brand: ${error}`);
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
