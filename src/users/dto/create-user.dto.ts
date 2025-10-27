import { IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEnum(Role)
  @IsOptional() // Bu alanı opsiyonel yapıyoruz, böylece varsayılan olarak 'user' atanır
  role?: Role;
}