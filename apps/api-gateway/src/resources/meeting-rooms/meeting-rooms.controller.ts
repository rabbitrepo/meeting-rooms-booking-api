import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { MeetingRoomsService } from './meeting-rooms.service';
import { CreateMeetingRoomsDto } from '@app/contracts/resources/meeting-rooms/create-meeting-rooms.dto';
import { UpdateMeetingRoomsDto } from './dto/update-meeting-rooms.dto';
import { AuthGuard } from '../../auth.guard';
import { FindBookingsByTimeDto } from '@app/contracts/bookings/find-bookings-by-time.dto';

@UseGuards(AuthGuard) // Apply the guard to all routes in this controller
@Controller('meeting-rooms')
export class MeetingRoomsController {
  constructor(private readonly meetingRoomsService: MeetingRoomsService) {}

  @Post()
  create(@Body() createMeetingRoomDto: CreateMeetingRoomsDto) {
    return this.meetingRoomsService.create(createMeetingRoomDto);
  }

  @Get()
  findAll() {
    return this.meetingRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingRoomsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeetingRoomDto: UpdateMeetingRoomsDto,
  ) {
    return this.meetingRoomsService.update(id, updateMeetingRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingRoomsService.remove(id);
  }

  @Get(':id/bookings')
  findBookings(
    @Param('id') id: string,
    @Query() query: FindBookingsByTimeDto, 
  ) {
    const { start, end } = query;
    return this.meetingRoomsService.findBookings(id, start, end);
  }
}
