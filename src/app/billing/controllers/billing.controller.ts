import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { BillingService } from '../services/billing.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { CreateInvoiceDto, PayInvoiceDto } from '../dto/invoice.dto';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { Response } from 'express';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';

@ApiBearerAuth()
@ApiTags('Billing')
@Controller('invoice')
export class BillingController {
constructor(private billingService: BillingService) {}



@Post('')
@ApiOperation({ summary: 'Create invoice' })
@ApiBody({ type: CreateInvoiceDto })
@ApiResponse({
status: HttpStatus.CREATED,
description: 'Invoice created successfully',
})
@UseGuards(AuthGuard)
@Roles(UserRole.ACCOUNTANT)
async createInvoice(@Body() data: CreateInvoiceDto) {
return this.billingService.createInvoice(data);
}

@Get('user')
@UseGuards(AuthGuard)
@Roles(UserRole.PATIENT)
@ApiOperation({ summary: 'Get all invoices for the logged-in patient with pagination' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
@ApiResponse({
status: HttpStatus.OK,
description: 'Invoices retrieved successfully',
})
async getInvoices(
@CurrentUser() user: User,
@Query() pagination: PaginationDto
) {
return this.billingService.getInvoices(user, pagination);
}

@Get('user/paid-invoices')
@UseGuards(AuthGuard)
@Roles(UserRole.PATIENT)
@ApiOperation({ summary: 'Get all paid invoices with pagination' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
async getUserPaidInvoices(
@CurrentUser() user: User,
@Query() pagination: PaginationDto) {
return this.billingService.getUserPaidInvoices(user, pagination);
}

@Get('user/unpaid-invoices')
@UseGuards(AuthGuard)
@Roles(UserRole.PATIENT)
@ApiOperation({ summary: 'Get all unpaid invoices with pagination' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
async getUserUnpaidInvoices(
@CurrentUser() user: User,
@Query() pagination: PaginationDto) {
return this.billingService.getUserUnpaidInvoices(user, pagination);
}

@Get('paid-invoices')
@UseGuards(AuthGuard)
@Roles(UserRole.ACCOUNTANT)
@ApiOperation({ summary: 'Get all paid invoices with pagination' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
async getAllPaidInvoices(@Query() pagination: PaginationDto) {
return this.billingService.getAllPaidInvoices(pagination);
}

@Get('unpaid-invoices')
@UseGuards(AuthGuard)
@Roles(UserRole.ACCOUNTANT)
@ApiOperation({ summary: 'Get all unpaid invoices with pagination' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
async getAllUnpaidInvoices(@Query() pagination: PaginationDto) {
return this.billingService.getAllUnpaidInvoices(pagination);
}



@Get(':id')
@UseGuards(AuthGuard)
@Roles(UserRole.PATIENT)
@ApiOperation({ summary: 'Get Invoice by ID for current user' })
@ApiResponse({ status: HttpStatus.OK, description: 'Invoice found' })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
async getInvoice(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string
) {
return this.billingService.getInvoice(user, id);
}



@Get('patient/:id')
@UseGuards(AuthGuard)
@Roles(UserRole.ACCOUNTANT)
@ApiOperation({ summary: 'Get patient invoice' })
@ApiResponse({ status: HttpStatus.OK, description: 'Get invoice' })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
getPatientInvoices(@Param('id', IsValidUUIDPipe) patientId: string) {
return this.billingService.getPatientInvoices(patientId);
}


@Post('pay/:invoiceId')
@UseGuards(AuthGuard)
@Roles(UserRole.PATIENT)
@ApiOperation({ summary: 'Make payment for an invoice' })
async payInvoice(
@CurrentUser() user: User,
@Param('invoiceId', IsValidUUIDPipe) invoiceId: string,
@Body() dto: PayInvoiceDto,
) {
return this.billingService.payInvoice(user, invoiceId, dto);
}


@Get('status/:id')
@UseGuards(AuthGuard)
@Roles(UserRole.ACCOUNTANT, UserRole.PATIENT)
@ApiOperation({ summary: 'Check payment status for an invoice' })
@ApiResponse({ status: 200, description: 'Returns the payment status' })
async getInvoiceStatus(
  @Param('id', IsValidUUIDPipe) id: string,
) {
  return this.billingService.checkPaymentStatus(id);
}

@Get('download/:id')
@UseGuards(AuthGuard)
@Roles(UserRole.PATIENT)
@ApiOperation({ summary: 'Download patient invoice' })
@ApiResponse({ status: HttpStatus.OK, description: 'Download invoice' })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
async downloadInvoice(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string,
@Res() res: Response,
) {
await this.billingService.generateInvoicePdf(user, id, res);
}

}


