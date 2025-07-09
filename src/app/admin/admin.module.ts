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
import { Inventory } from 'src/shared/entities/inventory.entity';
import { Admission } from 'src/shared/entities/admission.dto';
import { Appointment } from 'src/shared/entities/appointment.entity';
import { PassportModule } from '@nestjs/passport';
import { Invoice } from 'src/shared/entities/invoice.entity';

@Module({
imports: [
JwtModule.registerAsync({
inject: [ConfigService],
useFactory: async (configService: ConfigService) => ({
secret: configService.get<string>('JWT_SECRET'),
signOptions: {
expiresIn: `${configService.get<string>('JWT_EXPIRES_IN')}`,
},
}),
}),
TypeOrmModule.forFeature([Admin, Bed, User, Ward, Inventory, Admission,Invoice, Appointment]),
PassportModule,
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
]
})
export class AdminModule {}
