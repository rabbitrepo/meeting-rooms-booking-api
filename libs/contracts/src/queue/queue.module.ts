import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'BOOKING_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [
                        `amqp://${process.env.RMQ_USERNAME}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_URL}`,
                    ],
                    queue: 'booking_queue',
                },
            },
            {
                name: 'RESOURCE_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [
                        `amqp://${process.env.RMQ_USERNAME}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_URL}`,
                    ],
                    queue: 'resource_queue',
                },
            },
            {
                name: 'USER_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [
                        `amqp://${process.env.RMQ_USERNAME}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_URL}`,
                    ],
                    queue: 'user_queue',
                },
            },
        ]),
    ],
    exports: [ClientsModule], // Export ClientsModule so other modules can use it
})
export class QueueModule { }