import {
  Injectable,
  NotFoundException,
  ForbiddenException, 
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service'; 
import { Role } from 'src/users/enums/role.enum';
import { User } from 'src/users/entities/user.entity'; 

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  // --- YENİ GÖREV OLUŞTURMA (Admin) ---
  async create(createTaskDto: CreateTaskDto, reqUser: User): Promise<Task> {
    const { title, description, userId } = createTaskDto;
    let userToAssign: User | null;

    if (reqUser.role === Role.ADMIN) {
      // Admin ise: Gönderilen userId'yi kullan
      if (!userId) {
         throw new ForbiddenException('Admin must specify a user ID to assign the task to.');
      }
      userToAssign = await this.usersService.findOne(userId);
      if (!userToAssign) {
        throw new NotFoundException(`User with ID "${userId}" not found`);
      }
    } else if (reqUser.role === Role.USER) {
      if (userId && userId !== reqUser.id) {
         throw new ForbiddenException('Users can only assign tasks to themselves.');
      }
      userToAssign = reqUser; // Kendini ata
    } else {
       throw new ForbiddenException('Invalid user role.'); 
    }

// Görevi oluştur ve kullanıcıyı ata
    const task = this.taskRepository.create({
      title,
      description,
      user: userToAssign, 
    });

    return this.taskRepository.save(task);
  }

  // --- TÜM GÖREVLERİ LİSTELEME (Admin/User) ---
  async findAll(reqUser: User): Promise<Task[]> {
    
    // 1. Eğer giriş yapan 'ADMIN' ise, tüm görevleri göster
    if (reqUser.role === Role.ADMIN) {
      return this.taskRepository.find({ relations: ['user'] });
    }

    // 2. Eğer 'USER' ise, sadece kendi görevlerini göster
    return this.taskRepository.find({
      where: { user: { id: reqUser.id } }, // Sadece user.id'si eşleşenler
      relations: ['user'],
    });
  }

  // --- TEK BİR GÖREVİ GETİRME (Admin/User) ---
  async findOne(id: string, reqUser: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    // Yetki Kontrolü:
    // Eğer rol 'USER' ise VE görevin sahibi bu kullanıcı DEĞİLSE
    if (reqUser.role === Role.USER && task.user.id !== reqUser.id) {
      throw new ForbiddenException("You don't have permission to see this task");
    }

    return task;
  }

// --- GÖREV GÜNCELLEME (Admin/User - Güncellendi) ---
async update(id: string, updateTaskDto: UpdateTaskDto, reqUser: User): Promise<Task> {
    
  const task = await this.taskRepository.findOne({ 
    where: { id },
    relations: ['user'] 
  });
  if (!task) {
    throw new NotFoundException(`Task with ID "${id}" not found`);
  }

  const isAdmin = reqUser.role === Role.ADMIN;
  const isOwner = task.user?.id === reqUser.id;

  if (!isAdmin && !isOwner) {
    throw new ForbiddenException("You don't have permission to update this task");
  }

  if (!isAdmin && isOwner) {
    const requestedUpdates = Object.keys(updateTaskDto);
    
    if (requestedUpdates.length > 1 || (requestedUpdates.length === 1 && requestedUpdates[0] !== 'status')) {
       throw new ForbiddenException("Users can only update the status of their tasks.");
    }

    if (updateTaskDto.status === undefined) {
       throw new ForbiddenException("Status field is required for user update.");
    }
    updateTaskDto = { status: updateTaskDto.status }; 
  }

   const preloadedTask = await this.taskRepository.preload({
    id: id,
    ...updateTaskDto,
  });

  if (!preloadedTask) {
     throw new NotFoundException(`Task with ID "${id}" not found after preload`);
  }

  return this.taskRepository.save(preloadedTask);
}

  async remove(id: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    await this.taskRepository.remove(task);
  }
}