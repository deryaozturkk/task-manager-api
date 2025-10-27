import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { User } from 'src/users/entities/user.entity';
  import { Repository } from 'typeorm';
  import { UsersService } from 'src/users/users.service';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { CreateUserDto } from 'src/users/dto/create-user.dto';
  import { Role } from 'src/users/enums/role.enum';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      @InjectRepository(User)
      private userRepository: Repository<User>,
    ) {}
  

    async register(
      createUserDto: CreateUserDto,
    ): Promise<Omit<User, 'password' | 'hashPassword'>> { 
      const existingUser = await this.usersService.findByUsername(
        createUserDto.username,
      );
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
  
      const user = this.userRepository.create(createUserDto);
  
      //GEÇİCİ: HER ZAMAN Admin rolü ver (Test için - ilk kullanıcıyı admin yapalım)
      //if ((await this.userRepository.count()) === 0) {
        user.role = Role.ADMIN;
      //}
  
      const savedUser = await this.userRepository.save(user);
  
      const { password, ...result } = savedUser;
      return result;
    }
  

    async validateUser(username: string, pass: string): Promise<User | null> {
      const user = await this.usersService.findByUsername(username);
      if (user && (await bcrypt.compare(pass, user.password))) {
        return user;
      }
      return null;
    }

    async login(user: User) {
      const payload = {
        username: user.username,
        sub: user.id,
        role: user.role,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    // 1. Kullanıcıyı bul
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Mevcut şifreyi doğrula
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // 3. Yeni şifreyi hash'le ve kaydet
    // (user.entity.ts'teki @BeforeInsert hook'u burada çalışmaz, manuel hash'lemeliyiz)
    user.password = await bcrypt.hash(newPassword, 10);

    await this.userRepository.save(user);
  }
  }