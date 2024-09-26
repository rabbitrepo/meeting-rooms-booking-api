import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateMeetingRoomsDto {
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
