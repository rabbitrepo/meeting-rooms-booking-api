import { forwardRef, Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchSchema } from './models/branches.schema';
import { MeetingRoomsModule } from '../meeting-rooms/meeting-rooms.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Branch', schema: BranchSchema }]),
    forwardRef(() => MeetingRoomsModule),
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}
