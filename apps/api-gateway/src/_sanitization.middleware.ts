import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Helper function to recursively sanitize fields
    function sanitizeObject(obj: any) {
      if (typeof obj === 'string') {
        // Trim whitespace and sanitize HTML
        return sanitizeHtml(obj.trim());
      } else if (Array.isArray(obj)) {
        // Recursively sanitize array elements
        return obj.map((item) => sanitizeObject(item));
      } else if (typeof obj === 'object' && obj !== null) {
        // Recursively sanitize object properties
        return Object.keys(obj).reduce((acc, key) => {
          acc[key] = sanitizeObject(obj[key]);
          return acc;
        }, {} as any);
      }
      return obj;
    }

    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    next();
  }
}
