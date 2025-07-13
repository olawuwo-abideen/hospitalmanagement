import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { SupplyCategory } from '../../../shared/entities/inventory.entity';

export class CreateInventoryDto {

@ApiProperty({
description: 'The inventory name',
example: 'glove L size',
})
@IsString()
@IsNotEmpty()
itemName: string;

@ApiProperty({
description: 'The inventory category',
example: 'glove',
})
@IsEnum(SupplyCategory) 
@IsNotEmpty()
category: SupplyCategory;

@ApiProperty({
description: 'The inventory number',
example: '22',
})
@IsNotEmpty()
@IsInt()
quantity: number;

}


export class UpdateInventoryDto {

@ApiProperty({
description: 'The inventory name',
example: 'glove L size',
})
@IsString()
@IsNotEmpty()
itemName: string;

@ApiProperty({
description: 'The inventory category',
example: 'glove',
})
@IsEnum(SupplyCategory) 
@IsNotEmpty()
category: SupplyCategory;


}



export class RestockInventoryDto {

@ApiProperty({
description: 'The Inventory quantity',
example: '55',
})
@IsInt()
@Min(1)
quantity: number;
}