import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {

@ApiProperty({
description: 'Patient give review about the hospital',
example: '5',
})
@IsNotEmpty()
@IsInt()
@Min(1)
@Max(5)
rating: number;

@ApiProperty({
description: 'Patient comment about the hospital',
example: 'Their Doctors consistently demonstrates exceptional clinical judgment and a deep commitment to patient care, always going the extra mile to ensure thorough evaluation and optimal treatment plans; a true asset to our team.',
})
@IsString()
@IsNotEmpty()
comment: string;
}


export class UpdateReviewDto {

@ApiProperty({
description: 'Patient give review about the hospital',
example: '5',
})
@IsNotEmpty()
@IsInt()
@Min(1)
@Max(5)
rating: number;


@ApiProperty({
description: 'Patient comment about te hospital',
example: 'Their Doctors consistently demonstrates exceptional clinical judgment and a deep commitment to patient care, always going the extra mile to ensure thorough evaluation and optimal treatment plans; a true asset to our team.',
})
@IsString()
@IsNotEmpty()
comment: string;
}