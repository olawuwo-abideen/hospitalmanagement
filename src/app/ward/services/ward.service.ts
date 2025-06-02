import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bed } from 'src/shared/entities/bed.entity';
import { Ward } from 'src/shared/entities/ward.entity';
import { ILike, Repository } from 'typeorm';
import { CreateWardDto, UpdateWardDto } from '../dto/ward.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class WardService {

constructor(
@InjectRepository(Bed)
private bedRepository: Repository<Bed>,
@InjectRepository(Ward)
private wardRepository: Repository<Ward>
) {}



public async getWards(pagination: PaginationDto): Promise<{ message: string; data: Ward[] }> {
  const { page = 1, pageSize = 10 } = pagination;

  const [data] = await this.wardRepository.findAndCount({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return { message: 'Wards retrieved successfully', data };
}

public async searchWards(searchQuery: string | null, pagination: PaginationDto): Promise<{ message: string; data: Ward[] }> {
  let wards: Ward[];

  if (!searchQuery) {
    wards = await this.getWards(pagination).then(res => res.data);
  } else {
    wards = await this.wardRepository.find({
      where: {
        name: ILike(`%${searchQuery}%`),
      },
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });
  }

  return { message: 'Wards retrieved successfully', data: wards };
}


public async getTotalNumberOfWards(): Promise<{ message: string; total: number }> {
  const total = await this.bedRepository.count();
  return { message: 'Total number of beds retrieved successfully', total };
}




public async getWard(id: string): Promise<{ message: string; ward: Ward }> {
const ward = await this.wardRepository.findOne({ where: { id } });

if (!ward) {
throw new NotFoundException(`Album with ID ${id} not found`);
}

return { message: 'Album retrieved successfully', ward };
}




}
