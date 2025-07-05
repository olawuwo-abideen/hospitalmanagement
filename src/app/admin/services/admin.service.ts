import {
Injectable,
NotFoundException,
OnModuleInit,
UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../../../shared/entities/admin.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { Bed } from 'src/shared/entities/bed.entity';
import { CreateBedDto, UpdateBedDto } from 'src/app/bed/dto/bed.dto';
import { Ward } from 'src/shared/entities/ward.entity';
import { CreateWardDto, UpdateWardDto } from 'src/app/ward/dto/ward.dto';
import { User } from 'src/shared/entities/user.entity';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class AdminService implements OnModuleInit {
constructor(
@InjectRepository(Admin)
private readonly adminRepository: Repository<Admin>,
private readonly jwtService: JwtService,
private readonly configService: ConfigService,
@InjectRepository(Bed)
private bedRepository: Repository<Bed>,
@InjectRepository(Ward)
private wardRepository: Repository<Ward>,
@InjectRepository(User) 
private readonly userRepository: Repository<User>,

) {}

async onModuleInit() {
const email = this.configService.get<string>('ADMIN_EMAIL');
const password = this.configService.get<string>('ADMIN_PASSWORD');

if (!email || !password) {
throw new Error('Email or password is incorrect');
}

if (!(await this.adminRepository.exists({ where: { email } }))) {
const hashedPassword = await bcrypt.hash(password, 10);
await this.adminRepository.save({
email,
password: hashedPassword,
});
}
} 

public async findOne(where: FindOptionsWhere<Admin>): Promise<Admin | null> {
return await this.adminRepository.findOne({ where });
}

public async login({ email, password }: AdminLoginDto) {
const admin = await this.adminRepository.findOne({ where: { email } });
if (!admin || !(await bcrypt.compare(password, admin.password))) {
throw new UnauthorizedException('Email or password is incorrect');
}
return {
token: this.createAccessToken(admin),
admin,
};
}

public createAccessToken(admin: Admin): string {
return this.jwtService.sign({ sub: admin.id, role: 'admin' });
}


public async getAllUsers(pagination: PaginationDto): Promise<{ message: string; data: User[] }> {
  const { page = 1, pageSize = 10 } = pagination;

  const [data] = await this.userRepository.findAndCount({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return { message: 'Users retrieved successfully', data };
}


public async getBed(id: string): Promise<{ message: string; bed: Bed }> {
const bed = await this.bedRepository.findOne({ where: { id } });

if (!bed) {
throw new NotFoundException(`Bed with ${id} not found`);
}

return { message: 'Bed retrieved successfully', bed };
}


public async getUser(id: string): Promise<{ message: string; user: User }> {
const user = await this.userRepository.findOne({ where: { id } });
if (!user) {
throw new NotFoundException(`User with ID ${id} not found`);
}
return { message: 'User retrieved successfully', user };
}


public async deleteUser(params: { id: string }): Promise<{ message: string }> {
const { id } = params;
const user = await this.userRepository.findOne({ where: { id } });
if (!user) {
throw new NotFoundException(`User with ID ${id} not found.`);
}
await this.userRepository.delete(id);
return { message: `User with ID ${id} has been successfully deleted.` };
}


public async getStaffAccountStatus(id: string): Promise<{ message: string; accountActivation: boolean }> {
const user = await this.userRepository.findOne({ where: { id: id } });
if (!user) {
throw new NotFoundException(`User with ID ${id} not found.`);
}
return {
message: `Account status retrieved for user with ID ${id}.`,
accountActivation: user.accountActivation,
};
}


public async activateStaffAccount(id: string): Promise<{ message: string }> {
  const user = await this.userRepository.findOne({ where: { id: id } });
  console.log('Activating user with ID:', id, 'Found user:', user);
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found.`);
  }
  if (user.accountActivation === true) {
    return { message: `Account is already activated for user with ID ${id}.` };
  }
  user.accountActivation = true;
  await this.userRepository.save(user);
  return { message: `Staff account activated successfully for user with ID ${id}.` };
}




public async createBed(data: CreateBedDto): Promise<{ message: string; bed: Bed }> {
const bed = this.bedRepository.create({
bedNumber: data.bedNumber,
bedType: data.bedType,
bedStatus: data.bedStatus,
});
const savedBed = await this.bedRepository.save(bed);
return { message: 'Bed created successfully', bed: savedBed };
}


public async updateBed(id: string, data: UpdateBedDto): Promise<{ message: string; bed: Bed }> {
const updateResult = await this.bedRepository.update(id, data);
if (updateResult.affected === 0) {
throw new NotFoundException(`Bed with ID ${id} not found`);
}
const updatedBed = await this.bedRepository.findOne({ where: { id } });
return { message: 'Bed updated successfully', bed: updatedBed };
}


public async deleteBed(id: string): Promise<{ message: string }> {
const bed = await this.bedRepository.findOne({ where: { id } });
if (!bed) {
throw new NotFoundException(`Bed with ID ${id} not found`);
}
await this.bedRepository.delete(id);
return { message: 'Bed deleted successfully' };
}

public async createWard(data: CreateWardDto): Promise<{ message: string; ward: Ward }> {
const ward = this.wardRepository.create({
name: data.name,
floor: data.floor,
department: data.department,
});
const savedWard = await this.wardRepository.save(ward);
return { message: 'Ward created successfully', ward: savedWard };
}

public async updateWard(id: string, data: UpdateWardDto): Promise<{ message: string; ward: Ward }> {
const updateResult = await this.wardRepository.update(id, data);
if (updateResult.affected === 0) {
throw new NotFoundException(`Ward with ID ${id} not found`);
}
const updatedWard = await this.wardRepository.findOne({ where: { id } });
return { message: 'Ward updated successfully', ward: updatedWard };
}

public async deleteWard(id: string): Promise<{ message: string }> {
const ward = await this.wardRepository.findOne({ where: { id } });
if (!ward) {
throw new NotFoundException(`Ward with id ${id} not found`);
}
await this.wardRepository.delete(id);
return { message: 'Ward deleted successfully' };
}



public async addBedToWard(bedId: string, wardId: string): Promise<{ message: string; bed?: Bed }> {
const bed = await this.bedRepository.findOne({
where: { id: bedId },
relations: ['ward']
});
if (!bed) {
throw new NotFoundException('Bed not found');
}
if (bed.ward?.id === wardId) {
return {
message: 'Bed is already part of this ward',
bed,
};
}

const ward = await this.wardRepository.findOne({ where: { id: wardId } });
if (!ward) {
throw new NotFoundException('Ward not found');
}
bed.ward = ward;
const updatedBed = await this.bedRepository.save(bed);
return {
message: 'Bed added to Ward successfully',
bed: updatedBed,
};
}

async removeBedFromWard(wardId: string, bedId: string): Promise<{ message: string }> {
const bed = await this.bedRepository.findOne({
where: { id: bedId },
relations: ['ward'],
});
if (!bed) {
throw new NotFoundException(`Bed with ID ${bedId} not found`);
}
if (bed.ward?.id !== wardId) {
throw new NotFoundException(`Bed is not part of album ${wardId}`);
}
bed.ward = null;
await this.bedRepository.save(bed);
return { message: 'Bed removed from ward successfully' };
}




}
