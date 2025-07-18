import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { DrugCategory } from '../../../shared/entities/drug.entity';

export class CreateDrugDto {

@ApiProperty({
description: 'The drug name',
example: 'Vitamin C',
})
@IsString()
@IsNotEmpty()
name: string;

@ApiProperty({
description: 'The drug description',
example: 'A drug use to treat headache',
})
@IsString()
@IsNotEmpty()
description: string;

@ApiProperty({
description: 'The manufacture company',
example: 'Devon Pharmaceuticals Company Ltd',
})
@IsString()
@IsNotEmpty()
manufacturer: string;


@ApiProperty({
description: 'The drug expire date',
example: '2025-03-07T09:00:00.000Z',
})
@IsDateString()
@IsNotEmpty()
expiryDate: Date;

@ApiProperty({
description: 'The drug category ',
example: 'supplement',
})
@IsString()
@IsNotEmpty()
category: DrugCategory;


@ApiProperty({
description: 'The drug quantity',
example: '55',
})
@IsInt()
@IsNotEmpty()
quantity: number;
}



export class UpdateDrugDto {

@ApiProperty({
description: 'The drug name',
example: 'Vitamin C',
})
@IsString()
@IsNotEmpty()
name: string;

@ApiProperty({
description: 'The drug description',
example: 'A drug use to treat headache',
})
@IsString()
@IsNotEmpty()
description: string;

@ApiProperty({
description: 'The manufacture company',
example: 'Devon Pharmaceuticals Company Ltd',
})
@IsString()
@IsNotEmpty()
manufacturer: string;


@ApiProperty({
description: 'The drug expire date',
example: '2025-03-07T09:00:00.000Z',
})
@IsDateString()
@IsNotEmpty()
expiryDate: Date;


@ApiProperty({
description: 'The drug category ',
example: 'supplement',
})
@IsString()
@IsNotEmpty()
category: DrugCategory;

}




export class RestockDrugDto {

@ApiProperty({
description: 'The drug quantity',
example: '55',
})
@IsInt()
@Min(1)
quantity: number;
}
