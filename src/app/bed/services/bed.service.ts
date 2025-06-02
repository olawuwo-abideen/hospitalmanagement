import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bed, BedStatus } from 'src/shared/entities/bed.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class BedService {
constructor(
@InjectRepository(Bed)
private bedRepository: Repository<Bed>,

) {}

public async getAvailableBeds(pagination: PaginationDto): Promise<{ message: string; data: Bed[] }> {
  const { page = 1, pageSize = 10 } = pagination;

  const [data] = await this.bedRepository.findAndCount({
    where: { bedStatus: BedStatus.AVAILABLE },
    skip: (page - 1) * pageSize,
    take: pageSize,
    relations: ['ward']
  });

  return { message: 'Available beds retrieved successfully', data };
}

public async getTotalNumberOfBeds(): Promise<{ message: string; total: number }> {
  const total = await this.bedRepository.count();
  return { message: 'Total number of beds retrieved successfully', total };
}



public async getBeds(pagination: PaginationDto): Promise<{ message: string; data: Bed[] }> {
  const { page = 1, pageSize = 10 } = pagination;

  const [data] = await this.bedRepository.findAndCount({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return { message: 'Beds retrieved successfully', data };
}


public async getBed(id: string): Promise<{ message: string; bed: Bed }> {
const bed = await this.bedRepository.findOne({ where: { id } });

if (!bed) {
throw new NotFoundException(`Bed with ${id} not found`);
}

return { message: 'Bed retrieved successfully', bed };
}











}
