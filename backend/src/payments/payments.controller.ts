import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Idempotent } from '@node-idempotency/nestjs';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { RequestUser } from '../auth/auth.types';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('api/v1/payments')
@UseGuards(AuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Idempotent()
  async createPayment(@Body() dto: CreatePaymentDto, @CurrentUser() user: RequestUser) {
    return this.paymentsService.createPayment(dto, user);
  }

  @Get()
  async listPayments(@CurrentUser() user: RequestUser) {
    return this.paymentsService.listPayments(user);
  }
}
