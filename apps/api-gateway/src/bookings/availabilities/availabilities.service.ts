import { FindAvailabilitiesDto } from '@app/contracts/bookings/availabilities/find-availabilities.dto';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import sendMessagePattern from 'libs/patterns/MessagePattern';

@Injectable()
export class AvailabilitiesService {
  constructor(
    @Inject('BOOKING_SERVICE') private readonly bookingClient: ClientProxy,
  ) {}

  findByDateRange(findAvailabilitiesDto: FindAvailabilitiesDto) {
    const { start, end, meetingRoomId } = findAvailabilitiesDto;

    // Convert startTime and endTime to Date objects
    const startTime = new Date(start);
    const endTime = new Date(end);

    // Validate start and end dates
    if (endTime <= startTime) {
      throw new HttpException('End time must be greater than start time', 400);
    }

    const pattern = { cmd: 'availabilities.findByDateRange' };
    return sendMessagePattern(this.bookingClient, pattern, {
      start,
      end,
      meetingRoomId,
    });
  }
}
