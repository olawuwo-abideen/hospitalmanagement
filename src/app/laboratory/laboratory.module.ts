import { Module } from '@nestjs/common';
import { LaboratoryController } from './controllers/laboratory.controller';
import { LaboratoryService } from './services/laboratory.service';
import { LabTest } from 'src/shared/entities/laboratory.entity';
import { User } from 'src/shared/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
  TypeOrmModule.forFeature([LabTest, User]),
  PassportModule,
  JwtModule.register({}),
  UserModule,
  AuthModule
  ],
  controllers: [LaboratoryController],
  providers: [LaboratoryService]
})
export class LaboratoryModule {}
