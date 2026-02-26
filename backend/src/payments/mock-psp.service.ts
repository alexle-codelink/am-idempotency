import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { sleep } from './payment-utils';

type MockPspResult = {
  approved: boolean;
  pspRef: string;
};

@Injectable()
export class MockPspService {
  async charge(): Promise<MockPspResult> {
    await sleep(400);
    return {
      approved: true,
      pspRef: `psp_${randomUUID()}`,
    };
  }
}
