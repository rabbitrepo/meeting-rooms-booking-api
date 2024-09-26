import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AvailabilitiesService } from './availabilities.service';
import { FindAvailabilitiesDto } from '@app/contracts/bookings/availabilities/find-availabilities.dto';

@Controller()
export class AvailabilitiesController {
  constructor(private readonly availabilitiesService: AvailabilitiesService) {}

  @MessagePattern({ cmd: 'availabilities.findByDateRange' })
  async findByDateRange(
    @Payload() findAvailabilitiesDto: FindAvailabilitiesDto,
  ) {
    return this.availabilitiesService.findByDateRange(findAvailabilitiesDto);
  }
}
