import { Controller, Body, ValidationPipe, Get, Param, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthDto } from '@app/contracts/users/auth.dto';
import { FindBookingsByTimeDto } from '@app/contracts/bookings/find-bookings-by-time.dto';
import { AuthGuard } from '../auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('auth')
  auth(@Body(ValidationPipe) authDto: AuthDto) {
    return this.usersService.auth(authDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id/bookings')
  async getUserBookings(
    @Param('id') id: string,                              // Extract user ID from the URL
    @Query() query: FindBookingsByTimeDto        // Use FindBookingsByTimeDto for validation
  ) {
    const { start, end } = query;                             // Extract validated start and end from the query
    return this.usersService.findBookings(id, start, end);
  }
}