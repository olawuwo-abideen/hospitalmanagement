import { Module } from '@nestjs/common';
import { BillingService } from './services/billing.service';
import { BillingController } from './controllers/billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../../shared/entities/user.entity';
import { Invoice } from '../../shared/entities/invoice.entity';
import { EmailModule } from '../../shared/modules/email/email.module';

@Module({
    imports: [
    TypeOrmModule.forFeature([ Invoice, User]),
    PassportModule,
    UserModule,
    AuthModule,
    EmailModule
    ],
  providers: [BillingService],
  controllers: [BillingController]
})
export class BillingModule {}
