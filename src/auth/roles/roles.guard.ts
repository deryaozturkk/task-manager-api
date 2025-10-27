import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles.decorator';
import { Role } from 'src/users/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Endpoint'in gerektirdiği rolleri al (örn: ['admin'])
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Eğer endpoint bir rol gerektirmiyorsa (herkese açıksa), izin ver
    if (!requiredRoles) {
      return true;
    }

    // 3. Kullanıcının bilgilerini al (JwtStrategy'den gelir, req.user içine koyulur)
    const { user } = context.switchToHttp().getRequest();

    // 4. Kullanıcının rolü, gereken rollerden herhangi biriyle eşleşiyor mu?
    return requiredRoles.some((role) => user.role === role);
  }
}