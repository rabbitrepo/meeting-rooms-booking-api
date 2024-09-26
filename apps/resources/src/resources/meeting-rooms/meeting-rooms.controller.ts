import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MeetingRoomsService } from './meeting-rooms.service';
import { CreateMeetingRoomsDto } from '@app/contracts/resources/meeting-rooms/create-meeting-rooms.dto';
import { UpdateMeetingRoomsDto } from '@app/contracts/resources/meeting-rooms/update-meeting-rooms.dto';

@Controller()
export class MeetingRoomsController {
  constructor(private readonly meetingRoomsService: MeetingRoomsService) {}

  @MessagePattern({ cmd: 'meetingRooms.create' })
  create(@Payload() createMeetingRoomsDto: CreateMeetingRoomsDto) {
    return this.meetingRoomsService.create(createMeetingRoomsDto);
  }

  @MessagePattern({ cmd: 'meetingRooms.findAll' })
  findAll() {
    return this.meetingRoomsService.findAll();
  }

  @MessagePattern({ cmd: 'meetingRooms.findOne' })
  findOne(@Payload() { id }: { id: string }) {
    return this.meetingRoomsService.findOne(id);
  }

  @MessagePattern({ cmd: 'meetingRooms.findByBranch' })
  findByBranch(@Payload() { id }: { id: string }) {
    return this.meetingRoomsService.findByBranch(id);
  }

  @MessagePattern({ cmd: 'meetingRooms.update' })
  update(@Payload() updateMeetingRoomsDto: UpdateMeetingRoomsDto) {
    return this.meetingRoomsService.update(
      updateMeetingRoomsDto.id,
      updateMeetingRoomsDto,
    );
  }

  @MessagePattern({ cmd: 'meetingRooms.remove' })
  remove(@Payload() { id }: { id: string }) {
    return this.meetingRoomsService.remove(id);
  }
}
