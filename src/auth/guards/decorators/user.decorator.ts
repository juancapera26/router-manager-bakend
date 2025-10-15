// src/auth/decorators/user.decorator.ts
import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export interface AuthUser {
  uid: string;
  email?: string;
  role?: string | null;
}

export const User = createParamDecorator(
  (property: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<{user?: AuthUser}>();
    const user = req.user;

    if (!user) return undefined;

    return property ? user[property] : user;
  }
);
