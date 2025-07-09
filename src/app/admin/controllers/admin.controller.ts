import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { Public } from '../../../shared/decorators/public.decorator';
import { CreateBedDto, UpdateBedDto } from 'src/app/bed/dto/bed.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { CreateWardDto, UpdateWardDto } from 'src/app/ward/dto/ward.dto';
import { AdminAuthGuard } from '../guards/adminguard';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';


@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
constructor(private readonly adminService: AdminService) {}

@Public()
@Post('login')
@ApiOperation({ summary: 'Admin login' })
async login(@Body() user: AdminLoginDto) {
return this.adminService.login(user);
}

@ApiBearerAuth()
@Get('staff')
@ApiOperation({ summary: 'Get all staff users' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getAllStaffs(@Query() pagination: PaginationDto) {
return await this.adminService.getAllStaffs(pagination);
}

@ApiBearerAuth()
@Get('staff/count')
@ApiOperation({ summary: 'Get total number of staff' })
async getTotalStaffCount() {
return this.adminService.countAllStaffs();
}

@ApiBearerAuth()
@Get('users')
@ApiOperation({ summary: 'Get all users' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getAllUsers(@Query() pagination: PaginationDto) {
return await this.adminService.getAllUsers(pagination);
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
@Get('user/:id')
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
@Param('id', IsValidUUIDPipe) id: string,
) {
return this.adminService.activateStaffAccount(id);
}

//billing reveneue

@ApiBearerAuth()
@ApiOperation({ summary: 'Get billing Reveneue' })
@Get('revenue')
getRevenueStats() {
return this.adminService.getRevenueStats();
}

//reports

@ApiBearerAuth()
@Get('admissions')
@ApiOperation({ summary: 'Get patient admission overview' })
getAdmissions(@Query('month') month?: number, @Query('year') year: number = new Date().getFullYear()) {
return month
? this.adminService.getMonthlyAdmissions(month, year)
: this.adminService.getYearlyAdmissions(year);
}

@ApiBearerAuth()
@Get('discharges')
@ApiOperation({ summary: 'Get Patient discharge summary' })
getDischarges() {
return this.adminService.getDischargeSummary();
}

@ApiBearerAuth()
@Get('appointments')
@ApiOperation({ summary: 'Get appointment per doctor' })
getAppointmentsStats() {
return this.adminService.getAppointmentsPerDoctor();
}

@ApiBearerAuth()
@Get('inventory')
@ApiOperation({ summary: 'Get inventory report' })
getInventoryReport() {
return this.adminService.getInventoryReport();
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
