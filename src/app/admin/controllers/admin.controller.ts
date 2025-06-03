import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { LoginDto } from '../../auth/dto/login.dto';
import { Public } from '../../../shared/decorators/public.decorator';
import { CreateBedDto, UpdateBedDto } from 'src/app/bed/dto/bed.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { CreateWardDto, UpdateWardDto } from 'src/app/ward/dto/ward.dto';
import { identity } from 'rxjs';

@Controller('admin')
export class AdminController {
constructor(private readonly adminService: AdminService) {}

@Public()
@Post('login')
async login(@Body() user: LoginDto) {
return this.adminService.login(user);
}

@ApiBearerAuth()
@Delete('user/:id')
@ApiOperation({ summary: 'Delete a user' })
public async deleteUser(
@Param('id', IsValidUUIDPipe) id: string,
)  {    
return await this.adminService.deleteUser({ id });
}

@ApiBearerAuth()
@Get(':id')
@ApiOperation({ summary: 'Get a user' })
public async getUser(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.adminService.getUser(id)
}

@ApiBearerAuth()
@Get('staff/status/:id')
@ApiOperation({ summary: 'Get staff account activation status' })
async getStaffAccountStatus(
@Param('id', IsValidUUIDPipe) id: string,
) {
return this.adminService.getStaffAccountStatus(id);
}

@ApiBearerAuth()
@Patch('staff/activate/:id')
@ApiOperation({ summary: 'Activate staff account' })
async activateStaffAccount(
@Param('userId', IsValidUUIDPipe) id: string,
) {
return this.adminService.activateStaffAccount(id);
}

//bed

@ApiBearerAuth()
@Post('bed')
@ApiOperation({ summary: 'Create bed' })
public async createBed(
@Body() data: CreateBedDto,
) {
return await this.adminService.createBed(data)
}

@ApiBearerAuth()
@Put('bed/:id')
@ApiOperation({ summary: 'Update a bed' })
public async updateBed(
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateBedDto,
) {
return  await this.adminService.updateBed(
id,
data,
)
}

@ApiBearerAuth()
@Delete('bed/:id')
@ApiOperation({ summary: 'Delete a bed' })
public async deleteBed(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.adminService.deleteBed(id)
}

//ward
@ApiBearerAuth()
@Post('ward')
@ApiOperation({ summary: 'Create ward' })
public async createWard(
@Body() data: CreateWardDto,
) {
return await this.adminService.createWard(data)
}

@ApiBearerAuth()
@Put('ward/:id')
@ApiOperation({ summary: 'Update ward' })
public async updateWard(
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateWardDto,
) {
return  await this.adminService.updateWard(
id,
data,
)
}

@ApiBearerAuth()
@Delete('ward/:id')
@ApiOperation({ summary: 'Delete ward' })
public async deleteWard(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.adminService.deleteWard(id)
}


@ApiBearerAuth()
@Post(':bedId/:wardId')
@ApiOperation({ summary: 'Add bed to ward' })
async addBedToWard(
@Param('bedId') bedId: string,
@Param('wardId') wardId: string,
) {
return await this.adminService.addBedToWard(bedId, wardId);
}

@ApiBearerAuth()
@Delete(':wardId/:bedId')
@ApiOperation({ summary: 'Remove bed from ward' })
async removeBedFromWard(
@Param('wardId', IsValidUUIDPipe) wardId: string,
@Param('bedId', IsValidUUIDPipe) bedId: string,
) {
return this.adminService.removeBedFromWard(wardId, bedId);

}












}
