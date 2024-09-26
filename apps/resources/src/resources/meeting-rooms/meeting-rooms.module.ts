import { forwardRef, Module } from '@nestjs/common';
import { MeetingRoomsService } from './meeting-rooms.service';
import { MeetingRoomsController } from './meeting-rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingRoomSchema } from './models/meeting-rooms.schema';
import { BranchesModule } from '../branches/branches.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MeetingRoom', schema: MeetingRoomSchema },
    ]),
    forwardRef(() => BranchesModule),
  ],
  controllers: [MeetingRoomsController],
  providers: [MeetingRoomsService],
  exports: [MeetingRoomsService],
})
export class MeetingRoomsModule {}
