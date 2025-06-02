import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMedicalRecordDto {

@ApiProperty({
description: 'Doctor diagnose a patient',
example: 'X-ray image',
})
@IsString()
@IsNotEmpty()
diagnosis: string;

@ApiProperty({
description: 'Doctor give medication',
example: 'Prescribe of drugs',
})
@IsString()
@IsNotEmpty()
medication: string;


@ApiProperty({
description: 'Doctor give a treatment',
example: 'Patient needed a cast',
})
@IsString()
@IsNotEmpty()
treatment: string;
}



export class UpdateMedicalRecordDto {

@ApiProperty({
description: 'Doctor diagnose a patient',
example: 'X-ray image',
})
@IsString()
@IsNotEmpty()
diagnosis: string;

@ApiProperty({
description: 'Doctor give medication',
example: 'Prescribe of drugs',
})
@IsString()
@IsNotEmpty()
medication: string;


@ApiProperty({
description: 'Doctor give a treatment',
example: 'Patient needed a cast',
})
@IsString()
@IsNotEmpty()
treatment: string;
}