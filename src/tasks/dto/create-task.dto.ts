import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  // Görevin atanacağı kullanıcının ID'si
  @IsUUID()
  @IsOptional() // Opsiyonel yapıyoruz, admin isterse kendine atayabilir
  userId: string;
}