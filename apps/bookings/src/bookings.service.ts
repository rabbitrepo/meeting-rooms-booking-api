import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AvailabilitiesService } from './bookings/availabilities/availabilities.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBooking } from './bookings/models/bookings.schema';
import { UpdateBookingDto } from '@app/contracts/bookings/update-booking.dto';
import { RpcException } from '@nestjs/microservices';
import { CreateBookingDto } from '@app/contracts/bookings/bookings.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel('Booking')
    private readonly bookingModel: Model<IBooking>,
    @Inject(forwardRef(() => AvailabilitiesService))
    private readonly availabilitiesService: AvailabilitiesService,
  ) { }

  async checkAvailability(
    meetingRoomId: string,
    start: Date,
    end: Date,
    ignoreBookingId?: string, // Add an optional parameter to ignore the current booking
  ): Promise<{ available: boolean }> {
    // Validate startTime and endTime
    if (new Date(end) <= new Date(start)) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'End time must be greater than start time',
      });
    }

    // Build the query object
    const query: any = {
      meetingRoomId,
      startTime: { $lt: new Date(end) },
      endTime: { $gt: new Date(start) },
      status: 'confirmed',
    };

    // If we're updating, ignore the current booking by excluding its ID
    if (ignoreBookingId) {
      query._id = { $ne: ignoreBookingId };
    }

    // Check for conflicting bookings
    const conflictingBookings = await this.bookingModel.find(query).exec();

    return {
      available: conflictingBookings.length === 0,
    };
  }

  async create(createBookingDto: CreateBookingDto) {
    // Validate startTime and endTime
    if (
      new Date(createBookingDto.endTime) <= new Date(createBookingDto.startTime)
    ) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'End time must be greater than start time',
      });
    }

    // Check availability before creating a booking
    const availability = await this.checkAvailability(
      createBookingDto.meetingRoomId,
      new Date(createBookingDto.startTime),
      new Date(createBookingDto.endTime),
    );

    if (!availability.available) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message:
          'The meeting room is already booked for the specified time range',
      });
    }

    // Create a new booking
    const newBooking = new this.bookingModel(createBookingDto);
    const result = await newBooking.save();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Booking created successfully',
      data: {
        booking: result,
      },
    };
  }

  async findOne(id: string) {
    // Find a booking by its ID
    const booking = await this.bookingModel.findById(id).exec();

    if (!booking) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Booking with id: ${id} not found.`,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Booking retrieved successfully',
      data: {
        booking: booking,
      },
    };
  }

  async update(updateBookingDto: UpdateBookingDto) {
    const {
      id,
      startTime: newStartTime,
      endTime: newEndTime,
    } = updateBookingDto;

    // Retrieve the existing booking
    const existingBooking = await this.bookingModel.findById(id).exec();

    if (!existingBooking) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Booking with id: ${id} not found.`,
      });
    }

    // Merge new values with existing values
    const updatedBooking = {
      ...existingBooking.toObject(), // Convert existing booking to plain object
      ...updateBookingDto, // Merge with updated values from the request
      startTime: newStartTime
        ? new Date(newStartTime)
        : existingBooking.startTime, // Convert startTime to Date if provided
      endTime: newEndTime ? new Date(newEndTime) : existingBooking.endTime, // Convert endTime to Date if provided
    };

    const { meetingRoomId, startTime, endTime } = updatedBooking;
    // Check availability for the determined values
    const availability = await this.checkAvailability(
      meetingRoomId.toString(),
      startTime,
      endTime,
      id,
    );

    if (!availability.available) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message:
          'The meeting room is already booked for the specified time range',
      });
    }

    // Update the existing booking with the new values
    const result = await this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'Booking updated successfully',
      data: {
        booking: result,
      },
    };
  }

  async remove(id: string) {
    // Remove a booking by its ID
    // const deletedBooking = await this.bookingModel.findByIdAndDelete(id).exec();

    // update status to "cenceled"
    const deletedBooking = await this.bookingModel.findByIdAndUpdate(
      id,
      { status: 'canceled' },
      { new: true } // Return the updated document
    );

    if (!deletedBooking) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Booking with id: ${id} not found.`,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Booking deleted successfully',
      data: {
        booking: deletedBooking
      },
    };
  }

  async findByDateRange(start: Date, end: Date) {
    // Validate startTime and endTime
    if (new Date(end) <= new Date(start)) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'End time must be greater than start time',
      });
    }

    // Find bookings within the specified date range
    const result = await this.bookingModel
      .find({
        startTime: { $gte: new Date(start) },
        endTime: { $lte: new Date(end) },
      })
      .exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'Bookings retrieved successfully',
      data: {
        bookings: result,
      },
    };
  }

  async findByMeetingRoomAndDateRange(
    meetingRoomId: string,
    startDate: string,
    endDate: string
  ) {
    // Parse the dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate that startDate is before endDate
    if (end <= start) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'End date must be greater than start date',
      });
    }

    // Query to find bookings for the given meeting room within the date range
    const bookings = await this.bookingModel
      .find({
        meetingRoomId,
        startTime: { $lt: end }, // booking must start before the end date
        endTime: { $gt: start }, // booking must end after the start date
      })
      .exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'Bookings retrieved successfully',
      data: {
        bookings,
      },
    };
  }

  async findByUser(userId: string, start: string, end: string) {
    // Parse and validate dates
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Check if end date is greater than start date
    if (endDate <= startDate) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'End date must be greater than start date',
      });
    }

    // Build the query
    const query = {
      'user.id': userId, // Filter by user ID
      startTime: { $lt: endDate }, // Booking must start before end date
      endTime: { $gt: startDate }, // Booking must end after start date
    };

    // Execute the query
    const bookings = await this.bookingModel.find(query).exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'Bookings retrieved successfully',
      data: {
        bookings,
      },
    };
  }

}
