import { Inject, Injectable } from '@nestjs/common';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ClientProxy } from '@nestjs/microservices';
import sendMessagePattern from 'libs/patterns/MessagePattern';
import { CreateBookingDto } from '@app/contracts/bookings/bookings.dto';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('BOOKING_SERVICE') private readonly resouceClient: ClientProxy,
  ) {}

  create(createBookingDto: CreateBookingDto) {
    const pattern = { cmd: 'bookings.create' };
    return sendMessagePattern(this.resouceClient, pattern, createBookingDto);
  }

  findOne(id: string) {
    const pattern = { cmd: 'bookings.findOne' };
    return sendMessagePattern(this.resouceClient, pattern, { id });
  }

  update(id: string, updateBookingDto: UpdateBookingDto) {
    const pattern = { cmd: 'bookings.update' };
    return sendMessagePattern(this.resouceClient, pattern, {
      id,
      ...updateBookingDto,
    });
  }

  remove(id: string) {
    const pattern = { cmd: 'bookings.remove' };
    return sendMessagePattern(this.resouceClient, pattern, { id });
  }

  findByDateRange(start: Date, end: Date) {
    const pattern = { cmd: 'bookings.findByDateRange' };
    return sendMessagePattern(this.resouceClient, pattern, { start, end });
  }
}
