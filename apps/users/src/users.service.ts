import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthDto } from '@app/contracts/users/auth.dto';
import { Client, Users } from 'node-appwrite';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  async auth(authDto: AuthDto): Promise<any> {
    const { userId, sessionId } = authDto;

    const client = new Client()
      .setEndpoint(process.env.APP_WRITE_URL)
      .setProject(process.env.APP_WRITE_PROJECT_ID)
      .setKey(process.env.APP_WRITE_API_KEY);

    const users = new Users(client);

    const { total, sessions } = await users.listSessions(userId);

    if (total > 0) {
      const currentDate = new Date();

      for (const session of sessions) {
        const sessionExpireDate = new Date(session.expire);

        if (session.$id === sessionId && sessionExpireDate > currentDate) {
          return { status: HttpStatus.OK, message: 'User authenticated' };
        }
      }
    }

    throw new RpcException({
      status: HttpStatus.FORBIDDEN,
      message: 'User has no active session',
    });
  }
}
