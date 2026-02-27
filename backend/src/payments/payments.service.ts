import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestUser } from '../auth/auth.types';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentStatus } from './payment.enums';
import { MockPspService } from './mock-psp.service';

type PaymentResponse = {
  paymentId: string;
  orderId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  pspRef: string | null;
};

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly mockPspService: MockPspService,
  ) {}

  async createPayment(dto: CreatePaymentDto, user: RequestUser): Promise<PaymentResponse> {
    const existing = await this.paymentRepository.findOneBy({
      orderId: dto.orderId,
      orgId: user.orgId,
      userId: user.userId,
    });

    if (existing) {
      return {
        paymentId: existing.id,
        orderId: existing.orderId,
        status: existing.status,
        amount: existing.amount,
        currency: existing.currency,
        pspRef: existing.pspRef,
      };
    }

    const psp = await this.mockPspService.charge();
    const paymentId = `pay_${randomUUID()}`;

    const payment = this.paymentRepository.create({
      id: paymentId,
      orderId: dto.orderId,
      amount: dto.amount,
      currency: dto.currency,
      status: PaymentStatus.SUCCEEDED,
      pspRef: psp.pspRef,
      userId: user.userId,
      orgId: user.orgId,
    });
    await this.paymentRepository.save(payment);

    return {
      paymentId,
      orderId: payment.orderId,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      pspRef: payment.pspRef,
    };
  }

  async listPayments(user: RequestUser): Promise<PaymentEntity[]> {
    if (user.role === 'admin') {
      return this.paymentRepository.find({
        where: { orgId: user.orgId },
        order: { createdAt: 'DESC' },
      });
    }

    return this.paymentRepository.find({
      where: { orgId: user.orgId, userId: user.userId },
      order: { createdAt: 'DESC' },
    });
  }
}
