import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Idempotent } from '@node-idempotency/nestjs';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Idempotent()
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(dto);
  }

  @Get()
  async listPayments() {
    return this.paymentsService.listPayments();
  }
}
