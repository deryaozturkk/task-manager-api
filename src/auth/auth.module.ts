import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module'; 
import { PassportModule } from '@nestjs/passport'; 
import { JwtModule } from '@nestjs/jwt'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { User } from 'src/users/entities/user.entity'; 
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY_BUNU_SONRA_DEGISTIR', 
      signOptions: {
        expiresIn: '1d', // Token'lar 1 gün geçerli olacak
      },
    }),
  ],
  providers: [AuthService, LocalStrategy,JwtStrategy], 
  controllers: [AuthController], 
  exports: [PassportModule, JwtModule], 
})
export class AuthModule {}