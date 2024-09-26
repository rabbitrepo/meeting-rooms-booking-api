import { NestFactory } from '@nestjs/core';
import { BookingsModule } from './bookings.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookingsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RMQ_USERNAME}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_URL}`,
        ],
        queue: 'booking_queue',
      },
    },
  );
  app.listen();
}
bootstrap();