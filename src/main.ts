import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000); 
  await app.listen(3000);
  logger.log('server is listening on port:' + port)

}
bootstrap();
