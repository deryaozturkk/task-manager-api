import {
    Controller,
    Request,
    Post,
    UseGuards,
    Body,
    Patch, 
  HttpCode, 
  HttpStatus 
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { AuthService } from './auth.service';
  import { CreateUserDto } from 'src/users/dto/create-user.dto';
  import { ChangePasswordDto } from 'src/users/dto/change-password.dto'; 
  
  @Controller('auth') // Bu controller'daki tüm endpoint'ler /auth ile başlar
  export class AuthController {
    constructor(private authService: AuthService) {}
    // 'local' guard'ı, AuthGuard('local') ile tetikliyoruz.
    // Bu, LocalStrategy'yi (validateUser) çalıştırır.
    @UseGuards(AuthGuard('local')) 
    @Post('login')
    async login(@Request() req: any) {
      return this.authService.login(req.user);
    }
  

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
      // DTO'dan (Data Transfer Object) gelen veriyi doğrudan 'register' servisimize göndeririz.
      return this.authService.register(createUserDto);
    }

  @UseGuards(AuthGuard('jwt')) 
  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT) 
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(req.user.id, changePasswordDto);
  }
  }