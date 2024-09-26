import { Module } from '@nestjs/common';
import { BranchesModule } from './resources/branches/branches.module';
import { MeetingRoomsModule } from './resources/meeting-rooms/meeting-rooms.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    BranchesModule,
    MeetingRoomsModule,
    MongooseModule.forRoot(
      `${process.env.MONGO_BASE}/resources${process.env.MONGO_OPTIONS}`,
    ),
  ],
  controllers: [],
  providers: [],
})
export class ResourcesModule {}
