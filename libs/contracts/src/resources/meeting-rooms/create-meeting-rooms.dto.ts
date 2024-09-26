import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class CreateMeetingRoomsDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly branchId: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsBoolean()
  @IsOptional() // This makes the field optional
  readonly isAvailable?: boolean; // Optional and can be undefined
}
