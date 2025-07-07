import {
BadRequestException,
Injectable,
UnauthorizedException,
NotFoundException,
ConflictException
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { EntityManager, Repository } from 'typeorm';
import { SignupDto } from '../dto/signup.dto';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../../../shared/modules/email/email.service';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import * as bcryptjs from "bcryptjs"
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
constructor(
private readonly userService: UserService,
private readonly jwtService: JwtService,
private readonly configService: ConfigService,
@InjectEntityManager() private readonly entityManager: EntityManager,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
private readonly emailService: EmailService
) {}


public async signup(data: SignupDto) {
  const existingEmailUser = await this.userRepository.findOne({
    where: { email: data.email },
  });

  if (existingEmailUser) {
    throw new ConflictException('Email is already in use');
  }

  const existingPhoneUser = await this.userRepository.findOne({
    where: { phonenumber: data.phonenumber },
  });

  if (existingPhoneUser) {
    throw new ConflictException('Phone number is already in use');
  }

  const saltRounds = 10;
  const hashedPassword: string = await bcryptjs.hash(data.password, saltRounds);

  const user: User = this.userRepository.create({
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    phonenumber: data.phonenumber,
    role: data.role,
    password: hashedPassword,
    accountActivation: data.role === UserRole.PATIENT, 
  });

  const savedUser = await this.entityManager.transaction(async (manager) => {
    return await manager.save(User, user);
  });

  return {
    message: "User signed up successfully",
    user: savedUser,
  };
}

public async login({ email, password, twoFAToken }: LoginDto) {
  const user: User | null = await this.userService.findOne({ email });

  if (!user || !(await bcryptjs.compare(password, user.password))) {
    throw new UnauthorizedException('Email or password is incorrect');
  }
  if (user.enable2FA) {
    if (!twoFAToken) {
      return {
        message: '2FA token required',
        requires2FA: true
      };
    }

    const isTokenValid = speakeasy.totp.verify({
      secret: user.twoFASecret,
      token: twoFAToken,
      encoding: 'base32',
      window: 1, 
    });

    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid 2FA token');
    }
  }
  return {
    message: 'User logged in successfully',
    token: this.createAccessToken(user),
    user,
  };
}


public createAccessToken(user: User): string {
return this.jwtService.sign({ sub: user.id });
}

async forgotPassword(email: string): Promise<{message:string}> {
const user: User | null = await this.userService.findOne({ email });

if (!user) {
throw new NotFoundException(`Email does not exist in our record.`);
}

const payload = { email: user.email };
const token = this.jwtService.sign(payload, {
secret: this.configService.get<string>('JWT_SECRET'),
expiresIn: `${this.configService.get<string>('JWT_EXPIRES_IN')}`,
});

user.resetToken = token;

await this.userRepository.update(
{
id: user.id,
},
{
resetToken: token,
},
);
await this.emailService.sendResetPasswordLink(user);
return { message: 'Reset token sent to user email' };
}


public async decodeConfirmationToken(token: string) {
try {
const payload = await this.jwtService.verify(token, {
secret: this.configService.get('JWT_SECRET'),
});

return payload?.email;
} catch (error) {
if (error?.name === 'TokenExpiredError') {
throw new BadRequestException('Reset password link expired.');
}
throw new BadRequestException('Reset password link expired.');
}
}

async resetPassword(payload: ResetPasswordDto): Promise<{message:string}> {
const email = await this.decodeConfirmationToken(payload.token);

const user: User | null = await this.userService.findOne({
email,
resetToken: payload.token,
});

if (!user) {
throw new BadRequestException(`Reset token expired. please try again.`);
}
const saltRounds = 10;
const password = await bcryptjs.hash(payload.password, saltRounds);

await this.userRepository.update(
{ id: user.id },
{ password, resetToken: null },
);
return { message: 'Password reset successfully' };
}


}
