import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Role } from './enums/role.enum'; // Role enum'unu import etmeyi unutmayın

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findAll() {
    return this.userRepository.find({
      select: ['id', 'username', 'role'], // Şifreleri gönderme!
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  // --- ROL GÜNCELLEME METODU ---
  async updateRole(id: string, updateUserRoleDto: UpdateUserRoleDto, reqUser: User): Promise<Omit<User, 'password' | 'hashPassword'>> { // 💡 Dönüş tipini güncelledik
    const userToUpdate = await this.findOne(id);
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    if (userToUpdate.id === reqUser.id) {
       throw new ForbiddenException('Admins cannot change their own role.');
    }

    userToUpdate.role = updateUserRoleDto.role;
    const savedUser = await this.userRepository.save(userToUpdate);

    const { password, hashPassword, ...result } = savedUser; 
    return result; // Şifre ve hashPassword metodu olmayan nesneyi döndür
  }
}

