import { Module } from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';
import { AvailabilitiesController } from './availabilities.controller';
import { UsersModule } from '../../users/users.module';
import { AuthGuard } from '../../auth.guard';
import { QueueModule } from '@app/contracts/queue/queue.module';

@Module({
  imports: [QueueModule, UsersModule],
  controllers: [AvailabilitiesController],
  providers: [AvailabilitiesService, AuthGuard],
})
export class AvailabilitiesModule {}
