import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from '@app/contracts/resources/branches/create-branch.dto';
import { UpdateBranchDto } from '@app/contracts/resources/branches/update-branch.dto';

@Controller()
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @MessagePattern({ cmd: 'branches.create' })
  create(@Payload() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @MessagePattern({ cmd: 'branches.findAll' })
  findAll() {
    return this.branchesService.findAll();
  }

  @MessagePattern({ cmd: 'branches.findOne' })
  findOne(@Payload() { id }: { id: string }) {
    return this.branchesService.findOne(id);
  }

  @MessagePattern({ cmd: 'branches.update' })
  update(@Payload() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(updateBranchDto.id, updateBranchDto);
  }

  @MessagePattern({ cmd: 'branches.remove' })
  remove(@Payload() { id }: { id: string }) {
    return this.branchesService.remove(id);
  }
}
