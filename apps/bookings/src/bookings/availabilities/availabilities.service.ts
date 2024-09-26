import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BookingsService } from '../../bookings.service';
import { FindAvailabilitiesDto } from '@app/contracts/bookings/availabilities/find-availabilities.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AvailabilitiesService {
  constructor(
    @Inject(forwardRef(() => BookingsService))
    private readonly bookingsService: BookingsService,
  ) {}

  async findByDateRange(findAvailabilitiesDto: FindAvailabilitiesDto) {
    const { start, end, meetingRoomId } = findAvailabilitiesDto;

    // Convert startTime and endTime to Date objects
    const startTime = new Date(start);
    const endTime = new Date(end);

    // Validate start and end dates
    if (endTime <= startTime) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'End time must be greater than start time',
      });
    }

    // Check availability for the specified meeting room and date range
    const availability = await this.bookingsService.checkAvailability(
      meetingRoomId,
      startTime,
      endTime,
    );

    if (availability.available) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Availability confirmed',
        data: {
          available: true,
        },
      };
    } else {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message:
          'The meeting room is already booked for the specified time range',
        data: {
          available: false,
        },
      });
    }
  }
}
