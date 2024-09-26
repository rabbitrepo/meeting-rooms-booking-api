import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';
import { FindAvailabilitiesDto as GatewayDto } from './dto/find-availabilities.dto';
import { FindAvailabilitiesDto } from '@app/contracts/bookings/availabilities/find-availabilities.dto';
import { AuthGuard } from '../../auth.guard';

@UseGuards(AuthGuard) // Apply the guard to all routes in this controller
@Controller('availabilities')
export class AvailabilitiesController {
  constructor(private readonly availabilitiesService: AvailabilitiesService) {}

  @Get(':meetingRoomId')
  findByDateRange(
    @Query() query: GatewayDto,
    @Param('meetingRoomId') meetingRoomId: string,
  ) {
    // Create a DTO instance and include the meetingRoomId
    const findAvailabilitiesDto: FindAvailabilitiesDto = {
      ...query,
      meetingRoomId,
    };

    return this.availabilitiesService.findByDateRange(findAvailabilitiesDto);
  }
}
