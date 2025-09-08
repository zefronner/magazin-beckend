import { Module } from '@nestjs/common';
import { BestsellersService } from './bestsellers.service';
import { BestsellersController } from './bestsellers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BestsellerEntity } from './entities/bestseller.entity';
import { FileService } from 'src/file/file.service';
import { CategoryEntity } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BestsellerEntity, CategoryEntity])],
  controllers: [BestsellersController],
  providers: [BestsellersService, FileService],
})
export class BestsellersModule {}
