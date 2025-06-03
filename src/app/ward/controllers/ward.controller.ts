import { Body, Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { WardService } from '../services/ward.service';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { UserRole } from 'src/shared/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Ward')
@Controller('ward')
export class WardController {
constructor(private wardService: WardService) {}



@Get('')
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
@ApiOperation({ summary: 'Get ward' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getAlbums(@Query() paginationDto: PaginationDto) {
  return await this.wardService.getWards(paginationDto);
}


@Get('search')
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
@ApiOperation({ summary: 'Search ward' })
@ApiQuery({ name: 'query', required: false, example: 'emergency' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async searchWards(
  @Query('query') searchQuery: string | null,
  @Query() pagination: PaginationDto,
) {
  return await this.wardService.searchWards(searchQuery, pagination);
}

@Get('total')
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
@ApiOperation({ summary: 'Get total number of ward' })
public async getTotalNumberOfWards() {
  return await this.wardService.getTotalNumberOfWards();
}



@Get(':id')
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
@ApiOperation({ summary: 'Get a ward' })
public async getWard(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.wardService.getWard(id)

}


}
