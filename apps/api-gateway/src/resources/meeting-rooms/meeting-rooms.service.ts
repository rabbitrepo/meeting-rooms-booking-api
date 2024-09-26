import { Inject, Injectable } from '@nestjs/common';
import { CreateMeetingRoomsDto } from '@app/contracts/resources/meeting-rooms/create-meeting-rooms.dto';
import { ClientProxy } from '@nestjs/microservices';
import sendMessagePattern from 'libs/patterns/MessagePattern';

@Injectable()
export class MeetingRoomsService {
  constructor(
    @Inject('RESOURCE_SERVICE') private readonly resouceClient: ClientProxy,
    @Inject('BOOKING_SERVICE') private readonly bookingClient: ClientProxy,
  ) { }

  async create(createMeetingRoomsDto: CreateMeetingRoomsDto) {
    const pattern = { cmd: 'meetingRooms.create' };
    return sendMessagePattern(
      this.resouceClient,
      pattern,
      createMeetingRoomsDto,
    );
  }

  async findAll() {
    const pattern = { cmd: 'meetingRooms.findAll' };
    return sendMessagePattern(this.resouceClient, pattern, {});
  }

  async findOne(id: string) {
    const pattern = { cmd: 'meetingRooms.findOne' };
    return sendMessagePattern(this.resouceClient, pattern, { id });
  }

  async update(id: string, updateMeetingRoomsDto: any) {
    const pattern = { cmd: 'meetingRooms.update' };
    return sendMessagePattern(this.resouceClient, pattern, {
      id,
      ...updateMeetingRoomsDto,
    });
  }

  async remove(id: string) {
    const pattern = { cmd: 'meetingRooms.remove' };
    return sendMessagePattern(this.resouceClient, pattern, { id });
  }

  async findBookings(meetingRoomId: string, startDate: string, endDate: string) {
    const pattern = { cmd: 'bookings.findByMeetingRoom' };
    return sendMessagePattern(this.bookingClient, pattern, {
      meetingRoomId,
      startDate,
      endDate,
    });
  }
}
