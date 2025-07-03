import { Module } from '@nestjs/common';
import { PharmacyController } from './controllers/pharmacy.controller';
import { PharmacyService } from './services/pharmacy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drug } from 'src/shared/entities/drug.entity';
import { User } from 'src/shared/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
imports: [
TypeOrmModule.forFeature([ Drug, User]),
JwtModule.register({}),
UserModule,
AuthModule
],
controllers: [PharmacyController],
providers: [PharmacyService]
})
export class PharmacyModule {}
