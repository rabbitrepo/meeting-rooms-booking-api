import { Module } from '@nestjs/common';
import { MeetingRoomsService } from './meeting-rooms.service';
import { MeetingRoomsController } from './meeting-rooms.controller';
import { UsersModule } from '../../users/users.module';
import { AuthGuard } from '../../auth.guard';
import { QueueModule } from '@app/contracts/queue/queue.module';

@Module({
  imports: [QueueModule, UsersModule],
  controllers: [MeetingRoomsController],
  providers: [MeetingRoomsService, AuthGuard],
})
export class MeetingRoomsModule { }
