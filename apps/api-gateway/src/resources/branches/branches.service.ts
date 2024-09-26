import { Inject, Injectable } from '@nestjs/common';
import { CreateBranchDto } from '@app/contracts/resources/branches/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branches.dto';
import { ClientProxy } from '@nestjs/microservices';
import sendMessagePattern from 'libs/patterns/MessagePattern';

@Injectable()
export class BranchesService {
  constructor(
    @Inject('RESOURCE_SERVICE') private readonly resouceClient: ClientProxy,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const pattern = { cmd: 'branches.create' };
    return sendMessagePattern(this.resouceClient, pattern, createBranchDto);
  }

  async findAll() {
    const pattern = { cmd: 'branches.findAll' };
    return sendMessagePattern(this.resouceClient, pattern, {});
  }

  async findOne(id: string) {
    const pattern = { cmd: 'branches.findOne' };
    return sendMessagePattern(this.resouceClient, pattern, { id });
  }

  async findByBranch(id: string) {
    const pattern = { cmd: 'meetingRooms.findByBranch' };
    return sendMessagePattern(this.resouceClient, pattern, { id });
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    const pattern = { cmd: 'branches.update' };
    return sendMessagePattern(this.resouceClient, pattern, {
      id,
      ...updateBranchDto,
    });
  }

  async remove(id: string) {
    const pattern = { cmd: 'branches.remove' };
    return sendMessagePattern(this.resouceClient, pattern, { id });
  }
}
