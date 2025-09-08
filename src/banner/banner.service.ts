import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileService } from 'src/file/file.service';
import { BannerEntity } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {

  constructor(
    @InjectRepository(BannerEntity) private readonly bannerRepo: Repository<BannerEntity>,
    private readonly fileService: FileService
  ) {}

  async create(createBannerDto: CreateBannerDto, file: Express.Multer.File | any) {
    try {
      let photo = '';
      if(file) {
        photo = await this.fileService.createFile(file);
      };
      const banner = await this.bannerRepo.create({
        ...createBannerDto,
        image : photo
      });
      const savedBanner = await this.bannerRepo.save(banner);
      return {
        statusCode: 201,
        message: 'success',
        data: savedBanner
      }
    } catch (error) {
      throw new BadRequestException('Error on creating banner: ' + error);
    }
  }

  async findAll() {
    try {
      const banners = await this.bannerRepo.find();
      return {
        statusCode: 201,
        message: 'success',
        data: banners
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number) {
    const banner = await this.bannerRepo.findOne({
      where: { id }
    });
    if (!banner) {
      throw new NotFoundException('banner not found');
    }
  
    return {
      status_code: 200,
      message: 'success',
      data: banner,
    };
    
  }

  async update(id: number, updateBannerDto: UpdateBannerDto, file: Express.Multer.File | any ) {
    try {
      const banner = await this.bannerRepo.findOne({
        where: { id }
      });
      if (!banner) {
        throw new NotFoundException('banner not found');
      }

      let photo = banner.image;
      if (file) {
        photo = await this.fileService.createFile(file);
      
        if (banner.image && (await this.fileService.existFile(banner.image))) {
          await this.fileService.deleteFile(banner.image);
        }
      };
      await this.bannerRepo.update(id, {
        ...updateBannerDto,
        image: photo
      });
      const updatedBanner = await this.bannerRepo.findOne({ where: { id } });
      return {
        status_code: 200,
        message: 'success',
        data: updatedBanner,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: number) {
    const data = await this.bannerRepo.findOneBy({id});
    if (!data) {
      throw new NotFoundException('banner not found');
    }
    try {
      await this.bannerRepo.delete(id);
    } catch (error) {
      throw new BadRequestException(`Error on deleting banner: ${error}`);
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
