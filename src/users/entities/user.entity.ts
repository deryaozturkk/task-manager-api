import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany, 
} from 'typeorm';
import { Role } from '../enums/role.enum';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/entities/task.entity'; 

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'simple-enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  // "Bir (One) Kullanıcı, Birçok (Many) Göreve (Task) sahip olabilir."
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[]; // Bu, kullanıcının görevlerini tutacak sanal bir alandır

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}