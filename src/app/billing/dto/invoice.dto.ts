import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { StripePaymentMethod } from 'src/shared/entities/invoice.entity';

export class CreateInvoiceDto {

@ApiProperty({
description: 'The Patient ID',
example: '78f9e177-fe14-442d-96ae-21233cd87959',
})
@IsNotEmpty()
@IsUUID()
patientId: string;

@ApiProperty({
description: 'The invoice description',
example: 'The invoice for treatment payment',
})
@IsString()
@IsNotEmpty()
description: string;

@ApiProperty({
description: 'The payment amount',
example: '250',
})
@IsNumber()
amount: number;
}



export class PayInvoiceDto {
@ApiProperty({
description: 'The payment method',
example: 'card',
})
@IsEnum(StripePaymentMethod)
@IsNotEmpty()
paymentMethod: StripePaymentMethod;
}

