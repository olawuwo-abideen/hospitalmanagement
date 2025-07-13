import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../shared/entities/user.entity';
import { Review } from '../../shared/entities/review.entity';
import { Prescription } from '../../shared/entities/prescription.entity';
import { MedicalRecord } from '../../shared/entities/medical-record.entity';
import { Appointment } from '../../shared/entities/appointment.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
TypeOrmModule.forFeature([User, Review, Prescription, MedicalRecord, Appointment]),
CloudinaryModule,
forwardRef(() => AuthModule),
JwtModule,
PassportModule
],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
