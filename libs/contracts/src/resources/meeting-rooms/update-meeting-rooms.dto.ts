import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateMeetingRoomsDto {
  @IsMongoId()
  readonly id: string;

  @IsMongoId()
  @IsOptional()
  readonly branchId?: string;

  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsBoolean()
  @IsOptional()
  readonly isAvailable?: boolean;
}
