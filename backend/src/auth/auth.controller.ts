import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Controller('api/v1/auth')
export class AuthController {
  @Post('login')
  login(@Body() dto: LoginDto) {
    return {
      accessToken: `${dto.role}:${dto.orgId}:${dto.userId}`,
      user: {
        role: dto.role,
        orgId: dto.orgId,
        userId: dto.userId,
      },
    };
  }
}
