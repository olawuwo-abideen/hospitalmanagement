import { Module } from '@nestjs/common';
import { PatientController } from './controllers/patient.controller';
import { PatientService } from './services/patient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/shared/entities/user.entity';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { Admission } from 'src/shared/entities/admission.dto';

@Module({
  imports: [
  TypeOrmModule.forFeature([ User, Admission]),
  JwtModule.register({}),
  UserModule,
  AuthModule
  ],
  controllers: [PatientController],
  providers: [PatientService]
})
export class PatientModule {}
