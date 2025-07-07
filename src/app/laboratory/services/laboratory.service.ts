import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LabTest } from 'src/shared/entities/laboratory.entity';
import { User } from 'src/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateLabTestDto, UpdateLabResultDto } from '../dto/test.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class LaboratoryService {
constructor(
@InjectRepository(LabTest)
private readonly laboratoryTestRepository: Repository<LabTest>,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
) {}


async requestLabTest(data: CreateLabTestDto): Promise<{ message: string; data: LabTest }> {
const patient = await this.userRepository.findOne({ where: { id: data.patientId } });
if (!patient) throw new NotFoundException('Patient not found');

const labTest = this.laboratoryTestRepository.create({
testType: data.testType,
patient,
});

const savedTest = await this.laboratoryTestRepository.save(labTest);
return {
message: 'Lab test requested successfully',
data: savedTest,
};
}

async getTestResult(id: string): Promise<{ message: string; data: LabTest }> {
const test = await this.laboratoryTestRepository.findOne({ where: { id }, relations: ['patient'] });
if (!test) throw new NotFoundException('Test result not found');
return {
message: 'Lab test result retrieved successfully',
data: test,
};
}

async updateTestResult(id: string, data: UpdateLabResultDto): Promise<{ message: string; data: LabTest }> {
const test = await this.getTestResult(id).then(res => res.data); 
Object.assign(test, data);
const updated = await this.laboratoryTestRepository.save(test);
return {
message: 'Lab test result updated successfully',
data: updated,
};
}

async getAllTestsForPatient(
  patientId: string,
  pagination: PaginationDto,
): Promise<{ message: string; data: LabTest[] }> {
  const { page = 1, pageSize = 10 } = pagination;

  const [tests] = await this.laboratoryTestRepository.findAndCount({
    where: { patient: { id: patientId } },
    relations: ['patient'],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    message: 'Lab tests retrieved successfully',
    data: tests,
  };
}


}
