import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { CustomValidationPipe } from './validation.pipe';
// import { SanitizationMiddleware } from './sanitization.middleware';
async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.setGlobalPrefix('api/v1');
  // app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.use(new SanitizationMiddleware().use);
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*', // Allow all headers (use carefully)
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

// Test CI/CD Pipeline
console.log("Hoo ray!")
