import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { RpcException } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { IBooking } from './bookings/models/bookings.schema';
import { CreateBookingDto } from '@app/contracts/bookings/create-booking.dto';
import { UpdateBookingDto } from '@app/contracts/bookings/update-booking.dto';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingModel: Model<IBooking>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getModelToken('Booking'),
          useValue: {
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingModel = module.get<Model<IBooking>>(getModelToken('Booking'));
  });

  describe('checkAvailability', () => {
    it('should return true if time slot is available', async () => {
      const meetingRoomId = 'room1';
      const start = new Date('2024-09-09T10:00:00Z').toISOString();
      const end = new Date('2024-09-09T11:00:00Z');

      // Mock the find method to return an empty array
      jest.spyOn(bookingModel, 'find').mockResolvedValue([]);

      const result = await service.checkAvailability(meetingRoomId, start, end);
      expect(result).toEqual({ available: true });
    });

    it('should return false if time slot is not available', async () => {
      const meetingRoomId = 'room1';
      const start = new Date('2024-09-09T10:00:00Z').toISOString();
      const end = new Date('2024-09-09T11:00:00Z');

      // Mock the find method to return a non-empty array
      jest.spyOn(bookingModel, 'find').mockResolvedValue([{}]);

      const result = await service.checkAvailability(meetingRoomId, start, end);
      expect(result).toEqual({ available: false });
    });

    it('should throw error if end time is before start time', async () => {
      const meetingRoomId = 'room1';
      const start = new Date('2024-09-09T10:00:00Z');
      const end = new Date('2024-09-09T09:00:00Z');

      await expect(
        service.checkAvailability(meetingRoomId, start, end),
      ).rejects.toThrowError(
        new RpcException({
          status: 400,
          message: 'End time must be greater than start time',
        }),
      );
    });
  });

  describe('create', () => {
    it('should create a new booking successfully', async () => {
      const createBookingDto: CreateBookingDto = {
        meetingRoomId: 'room1',
        userId: 'user1',
        participants: ['user2'],
        name: 'Meeting',
        details: 'Details of the meeting',
        startTime: new Date('2024-09-09T10:00:00Z'),
        endTime: new Date('2024-09-09T11:00:00Z'),
        status: 'confirmed',
        isActive: true,
      };

      // Mock the save method to return the booking
      jest
        .spyOn(bookingModel.prototype, 'save')
        .mockResolvedValue(createBookingDto as any);

      const result = await service.create(createBookingDto);
      expect(result).toEqual({
        statusCode: 201,
        message: 'Booking created successfully',
        data: {
          booking: createBookingDto,
        },
      });
    });

    it('should throw error if end time is before start time', async () => {
      const createBookingDto: CreateBookingDto = {
        meetingRoomId: 'room1',
        userId: 'user1',
        participants: ['user2'],
        name: 'Meeting',
        details: 'Details of the meeting',
        startTime: new Date('2024-09-09T11:00:00Z'),
        endTime: new Date('2024-09-09T10:00:00Z'),
        status: 'confirmed',
        isActive: true,
      };

      await expect(service.create(createBookingDto)).rejects.toThrowError(
        new RpcException({
          status: 400,
          message: 'End time must be greater than start time',
        }),
      );
    });
  });

  describe('update', () => {
    it('should update booking successfully with all fields provided', async () => {
      const id = 'booking1';
      const updateBookingDto: UpdateBookingDto = {
        id,
        startTime: new Date('2024-09-09T10:00:00Z'),
        endTime: new Date('2024-09-09T11:00:00Z'),
        meetingRoomId: 'room1',
      };

      // Mock the findById method to return a booking
      jest.spyOn(bookingModel, 'findById').mockResolvedValue({
        id,
        startTime: new Date('2024-09-09T09:00:00Z'),
        endTime: new Date('2024-09-09T10:00:00Z'),
        meetingRoomId: 'room1',
        isActive: true,
      } as any);

      // Mock the findByIdAndUpdate method to return the updated booking
      jest
        .spyOn(bookingModel, 'findByIdAndUpdate')
        .mockResolvedValue(updateBookingDto as any);

      const result = await service.update(updateBookingDto);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Booking updated successfully',
        data: {
          booking: updateBookingDto,
        },
      });
    });

    it('should throw error if end time is before start time', async () => {
      const updateBookingDto: UpdateBookingDto = {
        id: 'booking1',
        startTime: new Date('2024-09-09T11:00:00Z'),
        endTime: new Date('2024-09-09T10:00:00Z'),
      };

      await expect(service.update(updateBookingDto)).rejects.toThrowError(
        new RpcException({
          status: 400,
          message: 'End time must be greater than start time',
        }),
      );
    });

    it('should throw error if booking not found', async () => {
      const updateBookingDto: UpdateBookingDto = {
        id: 'nonexistentBookingId',
        startTime: new Date('2024-09-09T10:00:00Z'),
        endTime: new Date('2024-09-09T11:00:00Z'),
      };

      // Mock the findById method to return null (not found)
      jest.spyOn(bookingModel, 'findById').mockResolvedValue(null);

      await expect(service.update(updateBookingDto)).rejects.toThrowError(
        new RpcException({
          status: 404,
          message: `Booking with id: ${updateBookingDto.id} not found.`,
        }),
      );
    });
  });

  describe('remove', () => {
    it('should remove a booking successfully', async () => {
      const id = 'booking1';

      // Mock the findByIdAndDelete method to return the deleted booking
      jest
        .spyOn(bookingModel, 'findByIdAndDelete')
        .mockResolvedValue({ id } as any);

      const result = await service.remove(id);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Booking deleted successfully',
        data: {
          delete: true,
        },
      });
    });

    it('should throw error if booking not found', async () => {
      const id = 'nonexistentBookingId';

      // Mock the findByIdAndDelete method to return null (not found)
      jest.spyOn(bookingModel, 'findByIdAndDelete').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrowError(
        new RpcException({
          status: 404,
          message: `Booking with id: ${id} not found.`,
        }),
      );
    });
  });
});
