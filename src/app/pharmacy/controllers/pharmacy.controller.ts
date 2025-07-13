import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDrugDto, RestockDrugDto, UpdateDrugDto } from '../dto/drug.dto';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../shared/entities/user.entity';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';
import { PharmacyService } from '../services/pharmacy.service';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';

@ApiBearerAuth()
@ApiTags('Pharmacy')
@Controller('drug')
export class PharmacyController {
    constructor(private readonly pharmacyService: PharmacyService) {}

@Post('')
@ApiOperation({ summary: 'Create drug' })
@ApiBody({ type: CreateDrugDto, 
description: 'Create drug' })
@ApiResponse({
status: HttpStatus.CREATED,
description:
'Drug created successfully.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.PHARMACIST)
async createDrug(
@Body() data: CreateDrugDto) {
return this.pharmacyService.createDrug(data);
}

@Get('')
@UseGuards(AuthGuard)
@Roles(UserRole.PHARMACIST)
@ApiOperation({ summary: 'Get Drugs' })
@ApiResponse({ 
status: HttpStatus.OK, 
description: 'Drugs retrieved successfully' })
@ApiOperation({ summary: 'Get drugs' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getDrugs(@Query() pagination: PaginationDto) {
  return await this.pharmacyService.getDrugs(pagination);
}

@Get('search')
@ApiOperation({ summary: 'Search a drug' })
@ApiQuery({ name: 'query', required: false, example: 'paracetamol' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async searchDrugs(
  @Query('query') searchQuery: string | null,
  @Query() pagination: PaginationDto,
) {
  return await this.pharmacyService.searchDrugs(searchQuery, pagination);
}

@Get('/expired')
@UseGuards(AuthGuard)
@Roles(UserRole.PHARMACIST)
@ApiOperation({ summary: 'Get expired drugs' })
@ApiResponse({ 
status: HttpStatus.OK, 
description: 'drug retrieved successfully' })
async getExpiredDrugs() {
  return this.pharmacyService.getExpiredDrugs();
}

@Get('/low-stock')
@UseGuards(AuthGuard)
@Roles(UserRole.PHARMACIST)
@ApiOperation({ summary: 'Get low stock drugs' })
@ApiResponse({ 
status: HttpStatus.OK, 
description: 'Drug retrieved successfully' })
async getLowStock() {
  return this.pharmacyService.getLowStockDrugs();
}

@Get(':id')
@UseGuards(AuthGuard)
@Roles(UserRole.PHARMACIST)
@ApiOperation({ summary: 'Get drug' })
@ApiResponse({ 
status: HttpStatus.OK, 
description: 'Drug retrieved successfully' })
@ApiResponse({
status: HttpStatus.NOT_FOUND,
description: 'Drug not found.',
})
async getDrug(
@Param('id', IsValidUUIDPipe)  id: string
) {
return this.pharmacyService.getDrug(id);
}

@Put(':id')
@UseGuards(AuthGuard)
@Roles(UserRole.PHARMACIST)
@ApiOperation({ summary: 'Update drug' })
@ApiBody({ type: UpdateDrugDto, 
description: 'Update drug' })
@ApiResponse({ 
status: HttpStatus.OK, 
description: 'Drug updated successfully' })
@ApiResponse({
status: HttpStatus.NOT_FOUND,
description: 'Drug not found.',
})
async updateDrug(
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateDrugDto) {
return this.pharmacyService.updateDrug( id, data);
}

@Delete(':id')
@UseGuards(AuthGuard)
@Roles(UserRole.PHARMACIST)
@ApiOperation({ summary: 'Delete drug' })
@ApiResponse({ 
status: HttpStatus.OK, 
description: 'drug deleted successfully' })
@ApiResponse({
status: HttpStatus.NOT_FOUND,
description: 'drug not found.',
})
async deleteDrug(
@Param('id', IsValidUUIDPipe) id: string) {
return this.pharmacyService.deleteDrug(id);
}

@Patch('restock/:id')
@UseGuards(AuthGuard)
@Roles(UserRole.PHARMACIST)
@ApiOperation({ summary: 'Restock drugs' })
@ApiResponse({ 
status: HttpStatus.OK, 
description: 'Drug updated successfully' })
async restockDrug(@Param('id', IsValidUUIDPipe) id: string, 
 @Body() data: RestockDrugDto) {
  return this.pharmacyService.restockDrug(id, data);
}




}
