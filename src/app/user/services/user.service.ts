import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
DeepPartial,
FindOptionsWhere,
Repository,
UpdateResult,
} from 'typeorm';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ChangePasswordDto } from '../dto/change-password.dto';
import {  UpdateProfileDto, UpdateStaffProfileDto } from '../dto/update-profile.dto';
import { CloudinaryService } from '../../../shared/cloudinary/services/cloudinary.service';
import * as speakeasy from 'speakeasy';

@Injectable()
export class UserService {
constructor(
@InjectRepository(User) private readonly userRepository: Repository<User>,
private readonly cloudinaryService: CloudinaryService,
) {}

public async findOne(where: FindOptionsWhere<User>): Promise<User | null> {
return await this.userRepository.findOne({ where });
}


public async create(data: DeepPartial<User>): Promise<User> {
const user: User = await this.userRepository.create(data);
return await this.userRepository.save(user);
}

public async update(
where: FindOptionsWhere<User>,
data: QueryDeepPartialEntity<User>,
): Promise<UpdateResult> {
return await this.userRepository.update(where, data);
}

public async exists(where: FindOptionsWhere<User>): Promise<boolean> {
const user: boolean = await this.userRepository.existsBy(where);

return user;
}

public async profile(user: User) {
return user; 
}


public async changePassword(
data: ChangePasswordDto,
user: User,
): Promise<{message:string}> {

if (!user.password) {
const foundUser = await this.userRepository.findOne({
where: { id: user.id },
});

if (!foundUser || !foundUser.password) {
throw new BadRequestException('No password found for the user.');
}

user = foundUser; 
}

const isCurrentPasswordValid = await bcryptjs.compare(
data.currentPassword,
user.password,
);
if (!isCurrentPasswordValid) {
throw new BadRequestException(
'The password you entered does not match your current password.',
);
}

if (data.password !== data.confirmPassword) {
throw new BadRequestException(
'New password and confirmation do not match.',
);
}

const saltRounds = 10;
const hashedNewPassword = await bcryptjs.hash(data.password, saltRounds);

await this.update(
{ id: user.id },
{ password: hashedNewPassword },
);

return {message:"Password updated successfully"};
}


public async updateProfile(
data: UpdateProfileDto,
user: User,
): Promise<{ message: string; user: User }> {
const dataToUpdate: Partial<User> = {
firstname: data.firstname,
lastname: data.lastname,
age: data.age,
phonenumber: data.phonenumber,
gender: data.gender,
};
Object.assign(user, dataToUpdate);

await this.userRepository.save(user);

return {
message: 'Profile updated successfully',
user,
};
}



public async updateStaffProfile(
data: UpdateStaffProfileDto,
user: User,
): Promise<{ message: string; user: User }> {
const dataToUpdate: Partial<User> = {
firstname: data.firstname,
lastname: data.lastname,
age: data.age,
phonenumber: data.phonenumber,
gender: data.gender,
specialization: data.specialization,
experienceyears: data.experienceyears
};
Object.assign(user, dataToUpdate);

await this.userRepository.save(user);

return {
message: 'Profile updated successfully',
user,
};
}

public async updateUserImage(
userimage: Express.Multer.File,
user: User,
): Promise<User> {
if (userimage) {
const uploadHeaderImage = await this.cloudinaryService.uploadFile(userimage);
user.userimage= uploadHeaderImage.secure_url;
}

await this.userRepository.save(user);

return user;
}


async initiate2FASetup(user: User): Promise<{ message: string; secret: string }> {
const secret = speakeasy.generateSecret();

await this.userRepository.update(user.id, {
tempTwoFASecret: secret.base32,
tempTwoFAExpiresAt: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes from now
});

return {
message: 'Secret generated, kindly verify within 3 minutes to complete 2FA setup',
secret: secret.base32,
};
}

async verify2FASetup(user: User, token: string): Promise<{ verified: boolean; message: string }> {
const now = new Date();

if (!user.tempTwoFASecret || !user.tempTwoFAExpiresAt) {
throw new BadRequestException('2FA setup not initiated');
}

if (user.tempTwoFAExpiresAt < now) {
await this.userRepository.update(user.id, {
tempTwoFASecret: null,
tempTwoFAExpiresAt: null,
});
throw new BadRequestException('2FA setup has expired. Please try again.');
}

const verified = speakeasy.totp.verify({
secret: user.tempTwoFASecret,
token,
encoding: 'base32',
window: 1,
});

if (!verified) {
return { verified: false, message: 'Invalid verification code' };
}

await this.userRepository.update(user.id, {
twoFASecret: user.tempTwoFASecret,
enable2FA: true,
tempTwoFASecret: null,
tempTwoFAExpiresAt: null,
});

return { verified: true, message: '2FA has been successfully enabled' };
}



async disable2FA(user: User): Promise<{ message: string }> {
await this.userRepository.update(user.id, {
twoFASecret: null,
enable2FA: false,
});

return {
message: '2FA has been successfully disabled',
};
}


}    
