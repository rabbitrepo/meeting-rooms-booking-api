import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { QueueModule } from '@app/contracts/queue/queue.module';
import { AuthGuard } from '../auth.guard';

@Module({
  imports: [QueueModule],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
  exports: [UsersService],
})
export class UsersModule { }
