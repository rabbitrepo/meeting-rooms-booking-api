import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiGatewayService {
  getHello(): string {
    return 'Hello from API Gateway!';
  }
}
