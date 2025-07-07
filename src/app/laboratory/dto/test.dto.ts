import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsEnum, IsString } from 'class-validator';
import { LabTestStatus, LabTestType } from 'src/shared/entities/laboratory.entity';

export class CreateLabTestDto {
  @ApiProperty({
    description: 'The test type',
    example: 'mri',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(LabTestType) 
  testType: LabTestType;

  @ApiProperty({
    description: 'The patient id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;
}

export class UpdateLabResultDto {
  @ApiProperty({
    description: 'The test result',
    example: 'No abnormalities detected',
  })
  @IsString()
  @IsNotEmpty()
  result: string;

  @ApiProperty({
    description: 'The test status',
    example: 'completed',
  })
  @IsNotEmpty()
  @IsEnum(LabTestStatus)
  status: LabTestStatus;
}
