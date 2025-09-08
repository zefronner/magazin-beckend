import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { BannerEntity } from './entities/banner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from 'src/file/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity])],
  controllers: [BannerController],
  providers: [BannerService, FileService],
})
export class BannerModule {}
