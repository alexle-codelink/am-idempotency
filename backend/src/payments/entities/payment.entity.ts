import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique } from 'typeorm';
import { PaymentStatus } from '../payment.enums';

@Entity({ name: 'payments' })
@Unique('uq_payments_order_scope', ['orderId', 'orgId', 'userId'])
export class PaymentEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'varchar' })
  status: PaymentStatus;

  @Column({ name: 'psp_ref', type: 'text', nullable: true })
  pspRef: string | null;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'org_id' })
  orgId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
