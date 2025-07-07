import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from '../user/services/user.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { User } from '../../shared/entities/user.entity';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';
import { EmailModule } from '../../shared/modules/email/email.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
imports: [
ConfigModule,
PassportModule.register({ defaultStrategy: 'jwt' }),
JwtModule.registerAsync({
imports: [ConfigModule],
inject: [ConfigService],
useFactory: async (configService: ConfigService) => ({
secret: configService.get<string>('JWT_SECRET'),
signOptions: {
expiresIn: `${configService.get<string>('JWT_EXPIRES_IN')}`,
},
}),
}),
TypeOrmModule.forFeature([User]),
CloudinaryModule,
EmailModule,
],
controllers: [AuthController],
providers: [
AuthService,
UserService,
JwtStrategy,
],
exports: [
AuthService,
JwtStrategy,
PassportModule,
JwtModule,
],
})
export class AuthModule {}
