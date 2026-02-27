import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { RequestUser } from './auth.types';

type RequestWithUser = Request & { user?: RequestUser };

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.slice('Bearer '.length).trim();
    const parts = token.split(':');

    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid token format');
    }

    const [role, orgId, userId] = parts;
    if ((role !== 'admin' && role !== 'member') || !orgId || !userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    request.user = { role, orgId, userId };
    return true;
  }
}
