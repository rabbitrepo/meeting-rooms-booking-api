import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { UsersModule } from '../../users/users.module';
import { AuthGuard } from '../../auth.guard';
import { QueueModule } from '@app/contracts/queue/queue.module';

@Module({
  imports: [QueueModule, UsersModule],
  controllers: [BranchesController],
  providers: [BranchesService, AuthGuard],
})
export class BranchesModule {}
