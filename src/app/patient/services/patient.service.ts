import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { User, UserRole } from 'src/shared/entities/user.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class PatientService {

    @InjectRepository(User) private readonly userRepository: Repository<User>

















public async getAllPatients(pagination: PaginationDto): Promise<{
  message: string;
  data: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}> {
  const { page = 1, pageSize = 10 } = pagination;

  const [data, total] = await this.userRepository.findAndCount({
    where: { role: UserRole.PATIENT },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    message: 'Patients retrieved successfully',
    data,
    currentPage: page,
    totalPages: Math.ceil(total / pageSize),
    totalItems: total,
  };
}


 async searchPatientsByName(
    search: string,
    pagination: PaginationDto,
  ): Promise<{
    message: string;
    data: User[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    const { page = 1, pageSize = 10 } = pagination;
    const skip = (page - 1) * pageSize;

    const [patients, total] = await this.userRepository.findAndCount({
      where: [
        { role: UserRole.PATIENT, firstname: ILike(`%${search}%`) },
        { role: UserRole.PATIENT, lastname: ILike(`%${search}%`) },
      ],
      skip,
      take: pageSize,
    });

    return {
      message: 'Patients search completed',
      data: patients,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
      totalItems: total,
    };
  }





public async getPatient(id: string): Promise<{ message: string; patient: User }> {
const patient = await this.userRepository.findOne({ where: { id } });

if (!patient) {
throw new NotFoundException(`Patient with ${id} not found`);
}

return { message: 'Patient retrieved successfully', patient };
}




}



