import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Token'ın 'Authorization' header'ından 'Bearer' olarak geleceğini belirtir
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. Token'ın süresinin dolup dolmadığını kontrol et
      ignoreExpiration: false,

      // 3. Token'ı imzalamak için kullandığımız gizli anahtar
      // BU, auth.module.ts'teki ile AYNI OLMALI!
      secretOrKey: 'SUPER_SECRET_KEY_BUNU_SONRA_DEGISTIR', 
    });
  }

  // Token başarılı bir şekilde doğrulandıktan sonra bu fonksiyon çalışır
  async validate(payload: any) {
    // 💡 'userId' olan alanı 'id' olarak değiştiriyoruz
    // Böylece req.user.id dediğimizde çalışacak.
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}