import {
Body,
Controller,
Get,
HttpStatus,
Param,
Post,
Put,
Query,
UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
ApiBody,
ApiOperation,
ApiQuery,
ApiResponse,
ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/entities/user.entity';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { LaboratoryService } from '../services/laboratory.service';
import {
CreateLabTestDto,
UpdateLabResultDto,
} from '../dto/test.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

@ApiBearerAuth()
@ApiTags('Laboratory')
@Controller('labtest')
export class LaboratoryController {
constructor(private laboratoryService: LaboratoryService) {}

@Post('')
@ApiOperation({ summary: 'Request test' })
@ApiBody({
type: CreateLabTestDto,
description: 'Test data',
})
@ApiResponse({
status: HttpStatus.CREATED,
description: 'Test created successfully.',
})
@UseGuards(AuthGuard())
@Roles(UserRole.DOCTOR)
async createTest(@Body() data: CreateLabTestDto) {
return this.laboratoryService.requestLabTest(data);
}

@Get(':id')
@UseGuards(AuthGuard())
@Roles(UserRole.DOCTOR, UserRole.LABTECHNICIAN)
@ApiOperation({ summary: 'Get test result by test ID' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Test result retrieved successfully',
})
public async getResult(@Param('id', IsValidUUIDPipe) id: string) {
return await this.laboratoryService.getTestResult(id);
}

@Put(':id')
@UseGuards(AuthGuard())
@Roles(UserRole.LABTECHNICIAN)
@ApiOperation({ summary: 'Update test result' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Update test result',
})
@ApiResponse({
status: HttpStatus.NOT_FOUND,
description: 'Test not found',
})
async updateTest(
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateLabResultDto,
) {
return this.laboratoryService.updateTestResult(id, data);
}

@Get(':patientId')
@UseGuards(AuthGuard())
@Roles(UserRole.DOCTOR, UserRole.LABTECHNICIAN)
@ApiOperation({ summary: 'Get all tests for a patient' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getTests(
@Param('patientId', IsValidUUIDPipe) patientId: string,
@Query() pagination: PaginationDto,
) {
return await this.laboratoryService.getAllTestsForPatient(patientId, pagination);
}
}
