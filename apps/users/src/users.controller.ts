import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthDto } from '@app/contracts/users/auth.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'users.auth' })
  async handleAuth(authDto: AuthDto): Promise<any> {
    return this.usersService.auth(authDto);
  }
}
