import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsIn(['admin', 'member'])
  role: 'admin' | 'member';

  @IsString()
  @IsNotEmpty()
  orgId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
