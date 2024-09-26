import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchDto } from './create-branch.dto';
import { IsMongoId } from 'class-validator';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @IsMongoId()
  readonly id: string;
}
