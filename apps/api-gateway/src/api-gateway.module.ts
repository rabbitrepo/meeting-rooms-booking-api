import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { UsersModule } from './users/users.module';
import { ResourcesModule } from './resources/resources.module';
import * as dotenv from 'dotenv';
import { APP_INTERCEPTOR } from '@nestjs/core';
// import { IdValidationInterceptor } from './id-validation.interceptor';
import { BookingsModule } from './bookings/bookings.module';
dotenv.config();

@Module({
  imports: [UsersModule, ResourcesModule, BookingsModule],
  controllers: [ApiGatewayController],
  providers: [
    ApiGatewayService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: IdValidationInterceptor,
    // },
  ],
})
export class ApiGatewayModule {}
