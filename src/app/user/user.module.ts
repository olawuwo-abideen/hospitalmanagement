import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/shared/entities/user.entity';
import { Review } from 'src/shared/entities/review.entity';
import { Prescription } from 'src/shared/entities/prescription.entity';
import { MedicalRecord } from 'src/shared/entities/medical-record.entity';
import { Appointment } from 'src/shared/entities/appointment.entity';

@Module({
  imports: [
TypeOrmModule.forFeature([User, Review, Prescription, MedicalRecord, Appointment]),
CloudinaryModule,
forwardRef(() => AuthModule),
JwtModule,
],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
