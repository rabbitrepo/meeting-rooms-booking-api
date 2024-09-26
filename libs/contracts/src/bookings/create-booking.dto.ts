import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsISO8601,
  IsMongoId,
} from 'class-validator';

export class CreateBookingDto {
  @IsMongoId()
  @IsNotEmpty()
  meetingRoomId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  participants: string[];

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsISO8601() // Validation still checks if this is a valid ISO 8601 string
  @IsNotEmpty()
  startTime: string; // Change to string to allow manual transformation

  @IsISO8601()
  @IsNotEmpty()
  endTime: string; // Same here
}
