import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      //Render'ın sağladığı tek bağlantı URL'sini kullanıyoruz
      // Bu URL, Render'da ayarladığınız DATABASE_URL ortam değişkeninden gelir.
      url: process.env.DATABASE_URL, 
      
      synchronize: true,
      autoLoadEntities: true,
      entities: [User, Task], 
      
      // Render gibi bulut ortamlarında zorunlu olan SSL ayarı
      // Bu, güvenli bağlantıyı sağlar.
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    TasksModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}