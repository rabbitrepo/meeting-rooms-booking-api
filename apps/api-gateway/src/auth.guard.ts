import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
// import { Observable } from 'rxjs';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;

    // Check for the presence of required headers
    if (!headers['x-user-id'] || !headers['x-session-id']) {
      return false; // Deny access if headers are missing
    }

    try {
      // Extract header values
      const userId = headers['x-user-id'];
      const sessionId = headers['x-session-id'];
      const authResult = await this.usersService.auth({ userId, sessionId });
      if (authResult.status === HttpStatus.OK) {
        return true;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false; // Deny access if headers are missing
    }
  }
}
