import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('base');
  app.enableCors({
    origin: ['http://localhost:3000',
    'https://magazin-beckend-production.up.railway.app'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`✅ Server running on port ${process.env.PORA ?? 3000} `);
  });
  
}
bootstrap();
