import {
    IsString,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    IsISO8601,
    IsMongoId,
    IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO for the User object
export class UserDto {
    @IsString()
    @IsNotEmpty()
    id: string; // uuidv4

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    employeeId: string;
}

// CreateBookingDto - used when creating a booking
export class CreateBookingDto {
    @IsMongoId()
    @IsNotEmpty()
    meetingRoomId: string; // ObjectId as string

    @ValidateNested() // Validate the nested user object
    @Type(() => UserDto) // Transform plain objects to UserDto instances
    @IsNotEmpty()
    user: UserDto; // Embedded User object

    @IsArray()
    @ValidateNested({ each: true }) // Validate each UserDto in the array
    @Type(() => UserDto) // Apply transformation for each user in the participants array
    @IsNotEmpty({ each: true })
    participants: UserDto[]; // Array of embedded User objects

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    details: string;

    @IsISO8601() // Ensures it's a valid ISO 8601 date string
    @IsNotEmpty()
    startTime: string;

    @IsISO8601()
    @IsNotEmpty()
    endTime: string;

    @IsOptional()
    @IsString()
    status?: 'confirmed' | 'canceled'; // Optional status field with default behavior
}

// UpdateBookingDto - used for updating a booking
export class UpdateBookingDto {
    @IsOptional()
    @IsMongoId()
    meetingRoomId?: string; // Optional

    @IsOptional()
    @ValidateNested()
    @Type(() => UserDto)
    user?: UserDto; // Optional User object

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserDto)
    participants?: UserDto[]; // Optional array of User objects

    @IsOptional()
    @IsString()
    name?: string; // Optional

    @IsOptional()
    @IsString()
    details?: string; // Optional

    @IsOptional()
    @IsISO8601()
    startTime?: string; // Optional

    @IsOptional()
    @IsISO8601()
    endTime?: string; // Optional

    @IsOptional()
    @IsString()
    status?: 'confirmed' | 'canceled'; // Optional
}