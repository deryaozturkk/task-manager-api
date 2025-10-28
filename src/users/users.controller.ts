import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe, 
  UseGuards, 
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport'; 
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from './enums/role.enum'; 
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN) // Sadece adminler başkalarının profilini görsün
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN) // Sadece adminler başkalarını güncellesin
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) { 
    return this.usersService.remove(id);
  }

  @Patch(':id/role') 
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK) // Başarılı olunca 200 OK döndürsün
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Request() req: any, // İstek yapan admini almak için (kendini değiştiremesin diye)
  ) {
    // Servis metodunu çağırıyoruz
    return this.usersService.updateRole(id, updateUserRoleDto, req.user); 
  }
}