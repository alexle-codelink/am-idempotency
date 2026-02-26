import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

}
