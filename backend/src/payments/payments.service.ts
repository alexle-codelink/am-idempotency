import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async createPayment(dto: CreatePaymentDto): Promise<PaymentResponse> {
    const existing = await this.paymentRepository.findOneBy({ orderId: dto.orderId });
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

  async listPayments(): Promise<PaymentEntity[]> {
    return this.paymentRepository.find({ order: { createdAt: 'DESC' } });
  }
}
