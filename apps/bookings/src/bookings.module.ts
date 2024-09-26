import { forwardRef, Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { AvailabilitiesModule } from './bookings/availabilities/availabilities.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { BookingSchema } from './bookings/models/bookings.schema';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      `${process.env.MONGO_BASE}/bookings${process.env.MONGO_OPTIONS}`,
    ),
    MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
    forwardRef(() => AvailabilitiesModule),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
