import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/enums/role.enum'; // Rol enum'umuzu import ediyoruz

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);