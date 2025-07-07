import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto, RestockInventoryDto, UpdateInventoryDto  } from '../dto/inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from 'src/shared/entities/inventory.entity';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class InventoryService {
constructor(
@InjectRepository(Inventory)
private readonly inventoryRepository: Repository<Inventory>,
) {}



async createInventory(
data: CreateInventoryDto
): Promise<{ message: string; inventory: Inventory }> {
const inventory = this.inventoryRepository.create({
itemName: data.itemName,
category: data.category,
quantity: data.quantity
});
const savedInventory = await this.inventoryRepository.save(inventory);
return {
message: 'Inventory created successfully',
inventory: savedInventory,
};
}

public async getInventories(pagination: PaginationDto): Promise<{ message: string; inventorys: Inventory[] }> {
const { page = 1, pageSize = 10 } = pagination;
const [inventorys] = await this.inventoryRepository.findAndCount({
skip: (page - 1) * pageSize,
take: pageSize,
});
return { message: 'Inventory retrieved successfully', inventorys };
}


async getInventory(
id: string
): Promise<{ message: string; data?: Inventory }> {
const inventory = await this.inventoryRepository.findOne({
where: { id },
});
if (!inventory) {
return { message: 'Inventory not found' };
}
return { message: 'Inventory retrieved successfully', 
data: inventory };
}


async updateInventory(
id: string,
data: UpdateInventoryDto
): Promise<{ message: string; inventory: Inventory }> {
const inventory = await this.inventoryRepository.findOne({
where: { id }, 
});
if (!inventory) {
throw new NotFoundException('DrInventoryug slot not found ');
}
Object.assign(inventory, {
itemName: data.itemName,
category: data.category,
});
const updatedInventory = await this.inventoryRepository.save(inventory);
return {
message: 'Inventory updated successfully',
inventory: updatedInventory
};
}


async deleteInventory(id: string): Promise<{ message: string }> {
const inventory = await this.inventoryRepository.findOne({
where: { id}, 
});
if (!inventory) {
throw new NotFoundException('Inventory not found');
}
await this.inventoryRepository.remove(inventory);
return { message: 'Inventory deleted successfully' };
}



async restockInventory(id: string, data: RestockInventoryDto) {
const inventory = await this.inventoryRepository.findOne({ where: { id } });
if (!inventory) {
throw new NotFoundException(`Inventory with ID ${id} not found`);
}
inventory.quantity += data.quantity;
await this.inventoryRepository.save(inventory);
return {
message: `${inventory.itemName} restocked successfully`,
newQuantity: inventory.quantity,
};
}



async getLowStockInventories() {
const allDrugs = await this.inventoryRepository.find();
return allDrugs.filter(drug => drug.quantity <= drug.lowStockThreshold);
}


}
