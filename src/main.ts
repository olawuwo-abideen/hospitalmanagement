import { NestFactory, HttpAdapterHost, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './shared/exceptions/http.exception';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,  
}));
    
    app.use(cookieParser())
    app.use(compression());
    app.use(helmet());
    app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    
  });

    const port = parseInt(String(process.env.PORT)) 

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder() 
    .setTitle('Hospital Management')
    .setDescription('An Hospital Management Api documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config); 
  SwaggerModule.setup('api-docs', app, document,{
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

    app.getHttpAdapter().get('/', (_, res) => {
    res.redirect('/api-docs');
  });

  await app.listen(port, '0.0.0.0')  || 3000;

}
bootstrap();