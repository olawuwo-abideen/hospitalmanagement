import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BedStatus, BedType } from 'src/shared/entities/bed.entity';

export class CreateBedDto {

@ApiProperty({
description: 'The bed number',
example: '002',
})
@IsString()
@IsNotEmpty()
bedNumber: number;


@ApiProperty({
description: 'The bed type',
example: 'icu',
})
@IsString()
@IsNotEmpty()
bedType: BedType;



@ApiProperty({
description: 'The bed status',
example: 'available',
})
@IsString()
@IsNotEmpty()
bedStatus: BedStatus;

}



export class UpdateBedDto {

@ApiProperty({
description: 'The bed number',
example: '002',
})
@IsString()
@IsNotEmpty()
bedNumber: number;


@ApiProperty({
description: 'The bed type',
example: 'icu',
})
@IsString()
@IsNotEmpty()
bedType: BedType;



@ApiProperty({
description: 'The bed status',
example: 'available',
})
@IsString()
@IsNotEmpty()
bedStatus: BedStatus;
}