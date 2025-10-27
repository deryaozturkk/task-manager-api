import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Modülün her yerde kullanılabilir olmasını sağla
      envFilePath: '.env', // Opsiyonel: Lokal için .env dosyası kullanabiliriz
      ignoreEnvFile: process.env.NODE_ENV === 'production', // Canlıda .env'yi yok say
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ConfigService'i kullanabilmek için import et
      inject: [ConfigService], // ConfigService'i enjekte et
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          ...(isProduction
            ? // --- CANLI (RENDER) AYARLARI ---
              {
                url: configService.get<string>('DATABASE_URL'), // Render'ın verdiği URL
                ssl: { rejectUnauthorized: false }, // SSL'i canlıda etkinleştir
              }
            : // --- LOKAL (DEVELOPMENT) AYARLARI ---
              {
                host: configService.get<string>('DB_HOST', 'localhost'), // Lokal host
                port: configService.get<number>('DB_PORT', 5432), // Lokal port
                username: configService.get<string>('DB_USER', 'postgres'), // Lokal kullanıcı
                password: configService.get<string>('DB_PASSWORD', 'postgres'), // Lokal şifre
                database: configService.get<string>('DB_NAME', 'newcomer_tasks'), // Lokal veritabanı adı
                // Lokal'de SSL yok
              }),
          
          synchronize: true, // Tabloları otomatik oluştur (Lokalde kullanışlı, canlıda dikkatli olunmalı)
          autoLoadEntities: true,
          entities: [User, Task],
        };
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

