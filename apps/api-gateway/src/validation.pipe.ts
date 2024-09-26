import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export class CustomValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: any) {
    // Perform the ID validation if the metadata type is a parameter
    if (metadata?.type === 'param') {
      if (value && !isValidObjectId(value)) {
        throw new BadRequestException('Invalid ID format.');
      }
    }

    // Continue with the original ValidationPipe logic
    return super.transform(value, metadata);
  }
}
