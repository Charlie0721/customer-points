import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
    // Configuración de Swagger
    const config = new DocumentBuilder()
    .setTitle('Api fidelización clientes ')
    .setDescription('API la cual controla los puntos de fidelización de los clientes')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
    // Configuración de ValidationPipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, 
        forbidNonWhitelisted: true, 
        transform: true, 
      }),
    ); 
  const logger = new Logger();
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3100); 
  await app.listen(port);
  logger.log('server is listening on port:' + port)

}
bootstrap();
