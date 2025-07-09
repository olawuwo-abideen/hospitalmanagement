import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../shared/services/typeorm/typeorm-config.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { PatientModule } from './patient/patient.module';
import { BedModule } from './bed/bed.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AvailabilitySlotModule } from './availabilityslot/availabilityslot.module';
import { RecordModule } from './record/record.module';
import { WardModule } from './ward/ward.module';
import { ReviewModule } from './review/review.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { InventoryModule } from './inventory/inventory.module';
import { BillingModule } from './billing/billing.module';

@Module({
imports: [
ConfigModule.forRoot({
isGlobal: true,
}),
ThrottlerModule.forRoot([
{
ttl: 60000,
limit: 10,
},
]),
TypeOrmModule.forRootAsync({
useClass: TypeOrmConfigService,

}),

AuthModule,
UserModule,
AdminModule,  
PatientModule, 
BedModule,  
AppointmentModule, 
AvailabilitySlotModule, 
RecordModule, 
WardModule, 
ReviewModule, 
PharmacyModule, 
LaboratoryModule, 
InventoryModule,
BillingModule
],
controllers: [],
providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    }
],
})
export class AppModule {}
