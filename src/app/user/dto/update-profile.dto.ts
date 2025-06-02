import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Gender, DoctorSpecilization } from '../../../shared/entities/user.entity';


export class UpdateProfileDto {
  @ApiProperty({
    description: 'First name of the user.',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    description: 'Age of the user.',
    example: 25,
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    description: 'Phone number of the user.',
    example: '08012345678',
  })
   @IsMobilePhone()
  @IsNotEmpty()
  phonenumber: string;

  @ApiProperty({
    description: 'The user gender. allowed values: female and male',
    enum: Gender,
    example: 'male',
  })
 @IsNotEmpty()
 gender: Gender;

}




export class UpdateStaffProfileDto {
  @ApiProperty({
    description: 'First name of the user.',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'Age of the user.',
    example: 25,
  })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({
    description: 'Phone number of the user.',
    example: '+1234567890',
  })
   @IsMobilePhone()
  @IsNotEmpty()
  phonenumber: string;

  @ApiProperty({
    description: 'The user gender. allowed values: female and male',
    enum: Gender,
    example: 'male',
  })
 @IsNotEmpty()
 gender: Gender;


 @ApiProperty({
  description: 'The staff area of specilization',
  enum: DoctorSpecilization,
  example: 'cardiology',
})
@IsNotEmpty()
specialization: DoctorSpecilization;

@ApiProperty({
  description: 'The staff years of experience',
  example: '3',
})
@IsNotEmpty()
experienceyears: number;



}