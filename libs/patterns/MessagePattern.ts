import { HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

export default async function sendMessagePattern<T>(
  client: ClientProxy,
  pattern: any,
  payload: any,
): Promise<T> {
  return firstValueFrom(
    client.send<T>(pattern, payload).pipe(
      catchError((err) => {
        console.error('Error occurred:', err);
        // Adjust error handling logic based on what you expect
        if (err.status === 'error') {
          throw new HttpException(err.message, 500);
        }
        throw new HttpException(err.message, err.status || 500);
      }),
    ),
  );
}
