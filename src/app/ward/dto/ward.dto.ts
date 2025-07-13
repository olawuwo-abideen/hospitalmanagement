import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BedStatus, BedType } from '../../../shared/entities/bed.entity';
import { Department } from '../../../shared/entities/ward.entity';

export class CreateWardDto {

@ApiProperty({
description: 'The ward name',
example: 'Emergency Ward',
})
@IsString()
@IsNotEmpty()
name: string;


@ApiProperty({
description: 'The ward floor',
example: '001',
})
@IsString()
@IsNotEmpty()
floor: number;



@ApiProperty({
description: 'The ward department',
example: 'emergency',
})
@IsString()
@IsNotEmpty()
department: Department;

}



export class UpdateWardDto {

@ApiProperty({
description: 'The ward name',
example: 'Emergency Ward',
})
@IsString()
@IsNotEmpty()
name: string;


@ApiProperty({
description: 'The ward floor',
example: '001',
})
@IsString()
@IsNotEmpty()
floor: number;



@ApiProperty({
description: 'The ward department',
example: 'emergency',
})
@IsString()
@IsNotEmpty()
department: Department;
}