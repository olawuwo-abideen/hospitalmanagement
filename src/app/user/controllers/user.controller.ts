import {
Controller,
Get,
Request,
Body,
Post,
Put,
UseInterceptors,
UploadedFile,
HttpStatus,
UseGuards
} from '@nestjs/common';
import RequestWithUser from '../../../shared/dtos/request-with-user.dto';
import { UserService } from '../services/user.service';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateProfileDto, UpdateStaffProfileDto } from '../dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import {Validate2faTokenDTO} from "../dto/validate-2fa-token.dto"

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
constructor(private readonly userService: UserService) {}

@Get('')
@ApiOperation({ summary: 'Get current user profile' })
@ApiResponse({ 
status: HttpStatus.OK,
description:
'User profile retrieve successfully.',
})
async getProfile(@Request() req: RequestWithUser) {
return await this.userService.profile(req.user);
}

@Post('change-password')
@ApiOperation({ summary: 'User change password' })
@ApiBody({ type: ChangePasswordDto, description: 'Change user password' })
@ApiResponse({
status: HttpStatus.OK,
description:
'User Password updated successfully',
})
public async changePassword(
@Body() payload: ChangePasswordDto,
@CurrentUser() user: User,
) {
return await this.userService.changePassword(payload, user);
}

@Put('')
@ApiOperation({ summary: 'Update user profile' })
@ApiBody({ type: UpdateProfileDto, description: 'Update user profile data' })
@ApiResponse({
status: HttpStatus.OK,
description:
'User profile updated successfully',
})
@UseGuards(AuthGuard) 
@Roles(UserRole.PATIENT)
public async updateProfile(
@Body() payload: UpdateProfileDto,
@CurrentUser() user: User,
) {
return await this.userService.updateProfile(payload, user);
}


@Put('staff')
@ApiOperation({ summary: 'Update user doctor profile' })
@ApiBody({ type: UpdateStaffProfileDto, description: 'Update doctor profile data' })
@ApiResponse({
status: HttpStatus.OK,
description:
'User profile updated successfully',
})
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
public async updateStaffProfile(
@Body() payload: UpdateStaffProfileDto,
@CurrentUser() user: User,
) {
return await this.userService.updateStaffProfile(payload, user);
}


@Put('user-image')
@ApiOperation({ summary: 'User update profile image ' })
@ApiBody({description: 'User update profile image' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Image update successfully.',
})
@UseInterceptors(FileInterceptor('profileimage'))
public async updateUserImage(
@UploadedFile() userimage: Express.Multer.File,
@CurrentUser() user: User,
) {
return await this.userService.updateUserImage(userimage, user);
}



@Post('initiate-2fa')
@ApiOperation({ summary: 'Initiate Multi Factor Authentication' })
async initiate2FASetup(
  @CurrentUser() user: User
): Promise<{ message: string, secret: string }> {
  return this.userService.initiate2FASetup(user);
}


@Post('verify-2fa')
@ApiOperation({ summary: 'Validate Multi Factor Authentication' })
async verify2FA(
@CurrentUser() user: User,
@Body()
ValidateTokenDTO: Validate2faTokenDTO,
): Promise<{ verified: boolean; message: string }> {
return this.userService.verify2FASetup(
user,
ValidateTokenDTO.token,
);
}


@Post('disable-2fa')
@ApiOperation({ summary: 'Disable 2 Factor Authentication' })
async disable2FA(
@CurrentUser() user: User,
): Promise<{  message: string }> {
return this.userService.disable2FA(user);
}





}
