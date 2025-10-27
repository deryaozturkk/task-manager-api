import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity'; 

export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  // "Birçok Görev (Task) Bir (One) Kullanıcıya (User) aittir."
  @ManyToOne(() => User, (user) => user.tasks, {
    /* onDelete: 'SET NULL' */
  }) // Bir kullanıcı silinirse, görevleri ne olsun? Şimdilik silinmesin.
  user: User; // Bu, veritabanında 'userId' adında bir sütun oluşturur
}