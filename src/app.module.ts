import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BannerModule } from './banner/banner.module';
import { BrandModule } from './brand/brand.module';
import { BestsellersModule } from './bestsellers/bestsellers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL as string,
      entities: [],
      autoLoadEntities: true,
      synchronize: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", '..', "base"),
      serveRoot: '/base'
    }),
    CategoriesModule,
    BannerModule,
    BrandModule,
    BestsellersModule
  ]
})
export class AppModule {}
