import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateInventoryDto,
  RestockInventoryDto,
  UpdateInventoryDto,
} from '../dto/inventory.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../../shared/entities/user.entity';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { InventoryService } from '../services/inventory.service';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';

@ApiBearerAuth()
@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create inventory' })
  @ApiBody({ type: CreateInventoryDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Inventory created successfully',
  })
  @UseGuards(AuthGuard())
  @Roles(UserRole.PHARMACIST)
  async createInventory(@Body() data: CreateInventoryDto) {
    return this.inventoryService.createInventory(data);
  }

  @Get()
  @UseGuards(AuthGuard())
  @Roles(UserRole.PHARMACIST)
  @ApiOperation({ summary: 'Get all inventories with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventories retrieved successfully',
  })
  async getInventories(@Query() pagination: PaginationDto) {
    return this.inventoryService.getInventories(pagination);
  }

  @Get('/low-stock')
  @UseGuards(AuthGuard())
  @Roles(UserRole.PHARMACIST)
  @ApiOperation({ summary: 'Get low stock inventories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Low stock items retrieved successfully',
  })
  async getLowStock() {
    return this.inventoryService.getLowStockInventories();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @Roles(UserRole.PHARMACIST)
  @ApiOperation({ summary: 'Get inventory by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Inventory found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  async getInventory(@Param('id', IsValidUUIDPipe) id: string) {
    return this.inventoryService.getInventory(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @Roles(UserRole.PHARMACIST)
  @ApiOperation({ summary: 'Update inventory' })
  @ApiBody({ type: UpdateInventoryDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  async updateInventory(
    @Param('id', IsValidUUIDPipe) id: string,
    @Body() data: UpdateInventoryDto,
  ) {
    return this.inventoryService.updateInventory(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @Roles(UserRole.PHARMACIST)
  @ApiOperation({ summary: 'Delete inventory' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  async deleteInventory(@Param('id', IsValidUUIDPipe) id: string) {
    return this.inventoryService.deleteInventory(id);
  }

  @Patch('restock/:id')
  @UseGuards(AuthGuard())
  @Roles(UserRole.PHARMACIST)
  @ApiOperation({ summary: 'Restock inventory item' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Restocked successfully' })
  async restockInventory(
    @Param('id', IsValidUUIDPipe) id: string,
    @Body() data: RestockInventoryDto,
  ) {
    return this.inventoryService.restockInventory(id, data);
  }
}
