import { Controller, ForbiddenException, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get()
  // getHello(): string {
  //   return this.apiGatewayService.getHello();
  // }

  // @Get('forbidden')
  getHello(): string {
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    throw new ForbiddenException();
  }
  // @Post()
  // sendMessage(): string {
  //   this.userServiceClient.emit('send-message', 'Hello World!');
  //   return 'Message sent!';
  // }
}
