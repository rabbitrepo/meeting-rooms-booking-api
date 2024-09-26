import { Controller } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { MessagePattern } from '@nestjs/microservices';
import { UpdateBookingDto } from '@app/contracts/bookings/update-booking.dto';
import { CreateBookingDto } from '@app/contracts/bookings/bookings.dto';

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @MessagePattern({ cmd: 'bookings.create' })
  async create(createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @MessagePattern({ cmd: 'bookings.findOne' })
  async findOne(data: { id: string }) {
    return this.bookingsService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'bookings.update' })
  async update(updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(updateBookingDto);
  }

  @MessagePattern({ cmd: 'bookings.remove' })
  async remove(data: { id: string }) {
    return this.bookingsService.remove(data.id);
  }

  @MessagePattern({ cmd: 'bookings.findByDateRange' })
  async findByDateRange(data: { start: Date; end: Date }) {
    return this.bookingsService.findByDateRange(data.start, data.end);
  }

  @MessagePattern({ cmd: 'bookings.findByMeetingRoom' })
  async findByMeetingRooms(data: { meetingRoomId: string, startDate: string, endDate: string }) {
    return this.bookingsService.findByMeetingRoomAndDateRange(data.meetingRoomId, data.startDate, data.endDate);
  }

  @MessagePattern({ cmd: 'bookings.findByUser' })
  async findByUser(data: { userId: string, start: string, end: string }) {
    return this.bookingsService.findByUser(data.userId, data.start, data.end);
  }
}
