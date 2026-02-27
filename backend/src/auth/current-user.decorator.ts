import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from './auth.types';

type RequestWithUser = Request & { user?: RequestUser };

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  return request.user;
});
