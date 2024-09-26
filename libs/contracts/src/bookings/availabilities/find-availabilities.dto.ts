import { IsNotEmpty, IsISO8601, IsMongoId } from 'class-validator';

export class FindAvailabilitiesDto {
  @IsISO8601() // Validation still checks if this is a valid ISO 8601 string
  @IsNotEmpty()
  start: string; // Change to string to allow manual transformation

  @IsISO8601()
  @IsNotEmpty()
  end: string; // Same here

  @IsMongoId()
  meetingRoomId: string; // Meeting room ID
}
