import { Module } from '@nestjs/common';
import { BedController } from './controllers/bed.controller';
import { BedService } from './services/bed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { Bed } from '../../shared/entities/bed.entity';
import { User } from '../../shared/entities/user.entity';
import { Ward } from '../../shared/entities/ward.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
imports: [
TypeOrmModule.forFeature([Bed, User, Ward]),
PassportModule,
JwtModule.register({}),
UserModule,
AuthModule
],
  controllers: [BedController],
  providers: [BedService]
})
export class BedModule {}
