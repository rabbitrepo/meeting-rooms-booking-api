import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from '../auth.guard';
import { FindBookingsByTimeDto } from '@app/contracts/bookings/find-bookings-by-time.dto';
import { CreateBookingDto } from '@app/contracts/bookings/bookings.dto';

@UseGuards(AuthGuard) // Apply the guard to all routes in this controller
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body(ValidationPipe) createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  findByDateRange(
    @Query('start') start: string, // UTC date string
    @Query('end') end: string, // UTC date string
  ) {
    return this.bookingsService.findByDateRange(new Date(start), new Date(end));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}