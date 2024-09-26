import { Module } from '@nestjs/common';
import { BranchesModule } from './branches/branches.module';
import { MeetingRoomsModule } from './meeting-rooms/meeting-rooms.module';

@Module({
  imports: [BranchesModule, MeetingRoomsModule],
  controllers: [],
  providers: [],
})
export class ResourcesModule {}
