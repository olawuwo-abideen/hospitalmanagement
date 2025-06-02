import { Controller, Delete, Get, HttpStatus, Param,UseGuards, Query } from '@nestjs/common';
import { PatientService } from '../services/patient.service';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';

@ApiBearerAuth()
@ApiTags('Patient')
@Controller('patient')
export class PatientController {

constructor(private readonly patientService: PatientService){}


@Get('patients')
@ApiOperation({ summary: 'Get all patients' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Successfully retrieved patients.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.NURSE)
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
async getAllPatients(@Query() paginationData: PaginationDto) {
return await this.patientService.getAllPatients(paginationData);
}

@Get('search-patients')
@ApiOperation({ summary: 'Search patients' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Successfully retrieved patients.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.NURSE)
async searchPatientsByName(
@Query('search') search: string,
@Query() pagination: PaginationDto,
) {
return this.patientService.searchPatientsByName(search, pagination);
}


@Get(':id')
@ApiOperation({ summary: 'Get a patients' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Successfully retrieved patients.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.NURSE)
@ApiOperation({ summary: 'Get a bed' })
public async getPatient(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.patientService.getPatient(id)

}


}