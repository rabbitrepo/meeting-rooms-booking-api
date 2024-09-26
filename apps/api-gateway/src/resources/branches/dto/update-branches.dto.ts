import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBranchDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
