import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/shared/entities/user.entity';
import { CreateDrugDto, RestockDrugDto, UpdateDrugDto } from '../dto/drug.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Drug } from 'src/shared/entities/drug.entity';
import { LessThan, Like, Raw, Repository } from 'typeorm';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';


@Injectable()
export class PharmacyService {
constructor(
@InjectRepository(Drug)
private readonly drugRepository: Repository<Drug>,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
) {}



async createDrug(
data: CreateDrugDto
): Promise<{ message: string; drug: Drug }> {
const drug = this.drugRepository.create({
name: data.name,
description: data.description,
manufacturer: data.manufacturer,
expiryDate: data.expiryDate,
category: data.category,
quantity: data.quantity
});

const savedDrug = await this.drugRepository.save(drug);

return {
message: 'Drug created successfully',
drug: savedDrug,
};
}

public async getDrugs(pagination: PaginationDto): Promise<{ message: string; drugs: Drug[] }> {
const { page = 1, pageSize = 10 } = pagination;

const [drugs] = await this.drugRepository.findAndCount({
skip: (page - 1) * pageSize,
take: pageSize,
});

return { message: 'Drugs retrieved successfully', drugs };
}

public async searchDrugs(
searchQuery: string | null,
pagination: PaginationDto,
): Promise<{ message: string; data: Drug[] }> {
const { page = 1, pageSize = 10 } = pagination;
let drugs: Drug[];

if (!searchQuery) {
drugs = await this.drugRepository.find({
skip: (page - 1) * pageSize,
take: pageSize,
});
} else {
drugs = await this.drugRepository.find({
where: [
{ name: Like(`%${searchQuery}%`) },
{
category: Raw((alias) => `${alias} LIKE '%${searchQuery}%'`),
},
],
skip: (page - 1) * pageSize,
take: pageSize,
});
}

return { message: 'Drugs retrieved successfully', data: drugs };
}

async getDrug(
id: string
): Promise<{ message: string; data?: Drug }> {
const drug = await this.drugRepository.findOne({
where: { id },
});


if (!drug) {
return { message: 'Drug not found' };
}

return { message: 'Drug retrieved successfully', 
data: drug };
}


async updateDrug(
id: string,
data: UpdateDrugDto
): Promise<{ message: string; drug: Drug }> {
const drug = await this.drugRepository.findOne({
where: { id }, 
});

if (!drug) {
throw new NotFoundException('Drug slot not found ');
}

Object.assign(drug, {
name: data.name,
manufacturer: data.manufacturer,
expiryDate: data.expiryDate,
category: data.category,
});

const updatedDrug = await this.drugRepository.save(drug);

return {
message: 'Drug updated successfully',
drug: updatedDrug
};
}


async deleteDrug(id: string): Promise<{ message: string }> {
const drug = await this.drugRepository.findOne({
where: { id}, 
});

if (!drug) {
throw new NotFoundException('Drug not found');
}

await this.drugRepository.remove(drug);

return { message: 'Drug deleted successfully' };
}




async getExpiredDrugs() {
const today = new Date(); 
return this.drugRepository.find({
where: {
expiryDate: LessThan(today),
},
});
}


async restockDrug(id: string, data: RestockDrugDto) {
const drug = await this.drugRepository.findOne({ where: { id } });
if (!drug) {
throw new NotFoundException(`Drug with ID ${id} not found`);
}
drug.quantity += data.quantity;
await this.drugRepository.save(drug);
return {
message: `${drug.name} restocked successfully`,
newQuantity: drug.quantity,
};
}



async getLowStockDrugs() {
const allDrugs = await this.drugRepository.find();
return allDrugs.filter(drug => drug.quantity <= drug.lowStockThreshold);
}




}
