import { IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';

export class UpdateUserRoleDto {
  @IsEnum(Role) // Değerin 'admin' veya 'user' olmasını zorunlu kılar
  role: Role;
}
