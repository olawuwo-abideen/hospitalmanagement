import { Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';
import { BedService } from '../services/bed.service';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';


@ApiBearerAuth()
@ApiTags('Bed')
@Controller('bed')
export class BedController {
constructor(private bedService: BedService) {}




@Get('available')
@ApiOperation({ summary: 'Get available beds' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getAvailableBeds(@Query() pagination: PaginationDto) {
  return await this.bedService.getAvailableBeds(pagination);
}


@Get('')
@ApiOperation({ summary: 'Get beds' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getBeds(@Query() pagination: PaginationDto) {
  return await this.bedService.getBeds(pagination);
}


@Get('total')
@ApiOperation({ summary: 'Get total number of beds' })
public async getTotalNumberOfBeds() {
  return await this.bedService.getTotalNumberOfBeds();
}


@Get(':id')
@ApiOperation({ summary: 'Get a bed' })
public async getBed(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.bedService.getBed(id)

}





}
