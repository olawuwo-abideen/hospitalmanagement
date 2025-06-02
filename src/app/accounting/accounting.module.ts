import { Module } from '@nestjs/common';
import { AccountingService } from './services/accounting.service';
import { AccountingController } from './controllers/accounting.controller';

@Module({
  providers: [AccountingService],
  controllers: [AccountingController]
})
export class AccountingModule {}
