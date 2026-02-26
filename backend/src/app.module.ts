import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeIdempotencyModule, StorageAdapterEnum } from '@node-idempotency/nestjs';
import { PaymentEntity } from './payments/entities/payment.entity';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'payment.sqlite',
      entities: [PaymentEntity],
      synchronize: true,
    }),
    NodeIdempotencyModule.forRootAsync({
      storage: {
        adapter: StorageAdapterEnum.redis,
        options: {
          url: process.env.REDIS_URL ?? 'redis://localhost:6379',
        },
      },
      enforceIdempotency: true,
      cacheTTLMS: 1000 * 60 * 60 * 24,
    }),
    PaymentsModule,
  ],
})
export class AppModule {}
