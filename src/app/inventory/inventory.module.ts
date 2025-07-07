import { Module } from '@nestjs/common';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from 'src/shared/entities/inventory.entity';
import { User } from 'src/shared/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
  TypeOrmModule.forFeature([ Inventory, User]),
  PassportModule,
  JwtModule.register({}),
  UserModule,
  AuthModule
  ],
  controllers: [InventoryController],
  providers: [InventoryService]
})
export class InventoryModule {}
