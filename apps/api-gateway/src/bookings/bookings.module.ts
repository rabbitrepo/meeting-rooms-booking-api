import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { AvailabilitiesModule } from './availabilities/availabilities.module';
import { AuthGuard } from '../auth.guard';
import { UsersModule } from '../users/users.module';
import { QueueModule } from '@app/contracts/queue/queue.module';

@Module({
  imports: [AvailabilitiesModule, QueueModule, UsersModule],
  controllers: [BookingsController],
  providers: [BookingsService, AuthGuard],
})
export class BookingsModule {}
