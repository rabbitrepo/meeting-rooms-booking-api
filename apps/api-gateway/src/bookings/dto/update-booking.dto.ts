import {
  IsString,
  IsOptional,
  IsArray,
  IsISO8601,
  IsMongoId,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export class UpdateBookingDto {
  @IsMongoId()
  @IsOptional()
  meetingRoomId?: string; // MongoDB ObjectId as a string

  @IsString()
  @IsOptional()
  userId?: string; // Regular string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @IsNotEmpty({ each: true })
  participants?: string[]; // Array of userIds as strings

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsISO8601()
  @IsOptional()
  startTime?: string; // Change to string to allow manual transformation

  @IsISO8601()
  @IsOptional()
  endTime?: string; // Same here

  @IsEnum(['confirmed', 'canceled'])
  @IsOptional()
  status?: 'confirmed' | 'canceled';

  @IsOptional()
  isActive: boolean;
}
