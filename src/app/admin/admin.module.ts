import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/shared/entities/admin.entity';
import { User } from 'src/shared/entities/user.entity';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Bed } from 'src/shared/entities/bed.entity';
import { Ward } from 'src/shared/entities/ward.entity';
import { WardModule } from '../ward/ward.module';
import { BedModule } from '../bed/bed.module';
import { AdminAuthGuard } from './guards/adminguard';
import { APP_GUARD } from '@nestjs/core';

@Module({
imports: [
// forwardRef(() => UserModule), 
JwtModule.registerAsync({
inject: [ConfigService],
useFactory: async (configService: ConfigService) => ({
secret: configService.get<string>('JWT_SECRET'),
signOptions: {
expiresIn: `${configService.get<string>('JWT_EXPIRES_IN')}`,
},
}),
}),
TypeOrmModule.forFeature([Admin, Bed, User, Ward]),
UserModule,
ConfigModule,
WardModule,
BedModule,
UserModule
],
controllers: [AdminController],
providers: [
AdminService,
AdminAuthGuard
// {
// provide: APP_GUARD,
// useClass: AdminAuthGuard
// },
]
})
export class AdminModule {}
