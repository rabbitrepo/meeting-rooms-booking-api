import { AuthDto } from '@app/contracts/users/auth.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import sendMessagePattern from 'libs/patterns/MessagePattern';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('BOOKING_SERVICE') private readonly bookingClient: ClientProxy,
  ) { }

  async auth(authDto: AuthDto): Promise<any> {
    const pattern = { cmd: 'users.auth' };
    return sendMessagePattern(this.userClient, pattern, authDto);
  }

  async findBookings(userId: string, start: string, end: string): Promise<any> {
    const pattern = { cmd: 'bookings.findByUser' };
    return sendMessagePattern(this.bookingClient, pattern, {
      userId,
      start,
      end,
    });
  }
}
