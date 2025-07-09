import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice, PaymentStatus } from 'src/shared/entities/invoice.entity';
import { User } from 'src/shared/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateInvoiceDto, PayInvoiceDto } from '../dto/invoice.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import Stripe from 'stripe';
import * as PDFDocument from 'pdfkit'; 
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { EmailService } from 'src/shared/modules/email/email.service';

@Injectable()
export class BillingService {
private stripe: Stripe;
constructor(
@InjectRepository(Invoice)
private readonly invoiceRepository: Repository<Invoice>,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
private readonly configService: ConfigService,
private readonly emailService: EmailService
) {
this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
apiVersion: '2025-06-30.basil'
});
}


async createInvoice(data: CreateInvoiceDto) {
const patient = await this.userRepository.findOne({ where: { id: data.patientId } });
if (!patient) throw new NotFoundException('Patient not found');
const invoice = this.invoiceRepository.create({ 
description: data.description,
amount: data.amount,
patient 
});
const saved = await this.invoiceRepository.save(invoice);
return { message: 'Invoice generated successfully', invoice: saved };
}



public async getInvoices(
user: User,
pagination: PaginationDto,
): Promise<{ message: string; invoices: Invoice[] }> {
const { page = 1, pageSize = 10 } = pagination;
const [invoices] = await this.invoiceRepository.findAndCount({
where: { patient: { id: user.id  } },
relations: ['patient'], 
skip: (page - 1) * pageSize,
take: pageSize,
order: { createdAt: 'DESC' },
});
return { message: 'Invoices retrieved successfully', invoices };
}


public async getInvoice(
user: User,
id: string
): Promise<{ message: string; data?: Invoice }> {
const invoice = await this.invoiceRepository.findOne({
where: {
id,
patient: { id: user.id }
},
relations: ['patient'],
});
if (!invoice) {
return { message: 'Invoice not found' };
}
return { message: 'Invoice retrieved successfully', data: invoice };
}


async getPatientInvoices(patientId: string) {
const invoices = await this.invoiceRepository.find({
where: { patient: { id: patientId } },
relations: ['patient'],
});
return { message: 'Billing history fetched', invoices };
}


async getUserPaidInvoices(
user: User,
pagination: PaginationDto,
): Promise<{ message: string; data: Invoice[]; total: number }> {
const { page = 1, pageSize = 10 } = pagination;
const [data, total] = await this.invoiceRepository.findAndCount({
where: { patient: { id: user.id }, status: PaymentStatus.PAID  },
skip: (page - 1) * pageSize,
take: pageSize,
order: { createdAt: 'DESC' },
});
return {
message: 'Paid invoices retrieved successfully',
data,
total,
};
}

async getUserUnpaidInvoices(
user: User,
pagination: PaginationDto,
): Promise<{ message: string; data: Invoice[]; total: number }> {
const { page = 1, pageSize = 10 } = pagination;
const [data, total] = await this.invoiceRepository.findAndCount({
where: { patient: { id: user.id }, status: In([PaymentStatus.PENDING, PaymentStatus.UNPAID]), },
skip: (page - 1) * pageSize,
take: pageSize,
order: { createdAt: 'DESC' },
});
return {
message: 'Unpaid invoices retrieved successfully',
data,
total,
};
}


async getAllPaidInvoices(
pagination: PaginationDto,
): Promise<{ message: string; data: Invoice[]; total: number }> {
const { page = 1, pageSize = 10 } = pagination;
const [data, total] = await this.invoiceRepository.findAndCount({
where: { status: PaymentStatus.PAID },
relations: ['patient'],
skip: (page - 1) * pageSize,
take: pageSize,
order: { createdAt: 'DESC' },
});
return {
message: 'Paid invoices retrieved successfully',
data,
total,
};
}


async getAllUnpaidInvoices(
pagination: PaginationDto,
): Promise<{ message: string; data: Invoice[]; total: number }> {
const { page = 1, pageSize = 10 } = pagination;
const [data, total] = await this.invoiceRepository.findAndCount({
where: { status: In([PaymentStatus.PENDING, PaymentStatus.UNPAID]), },
relations: ['patient'],
skip: (page - 1) * pageSize,
take: pageSize,
order: { createdAt: 'DESC' },
});
return {
message: 'Unpaid invoices retrieved successfully',
data,
total,
};
}



async payInvoice(user: User, id: string, dto: PayInvoiceDto) {
const invoice = await this.invoiceRepository.findOne({
where: { id },
relations: ['patient'],
});

if (!invoice) {
throw new NotFoundException('Invoice not found');
}
if (invoice.patient.id !== user.id) {
throw new ForbiddenException('You are not authorized to pay this invoice');
}
if (invoice.status === PaymentStatus.PAID) {
return { message: 'Invoice already paid', invoice };
}
const paymentIntent = await this.stripe.paymentIntents.create({
amount: Math.round(invoice.amount * 100), 
currency: 'usd',
metadata: {
invoiceId: invoice.id,
patientId: invoice.patient.id,
},
payment_method: dto.paymentMethod,
confirm: true,
});
invoice.status = PaymentStatus.PAID;
invoice.paymentMethod = dto.paymentMethod;
invoice.paymentIntentId = paymentIntent.id;
invoice.paidAt = new Date();

await this.invoiceRepository.save(invoice);
await this.emailService.sendSuccessfulPaymentMail(invoice);

return {
message: 'Invoice paid successfully',
invoice,
};
}



async checkPaymentStatus(invoiceId: string): Promise<{ message: string; status: string }> {
const invoice = await this.invoiceRepository.findOne({ where: { id: invoiceId } });
if (!invoice) throw new NotFoundException('Invoice not found');

if (!invoice.paymentIntentId) {
return { message: 'No payment initiated for this invoice', status: 'unpaid' };
}

const paymentIntent = await this.stripe.paymentIntents.retrieve(invoice.paymentIntentId);

return {
message: 'Payment status retrieved successfully',
status: paymentIntent.status, 
};
}




async generateInvoicePdf(user: User, id: string, response: Response) {
const invoice = await this.invoiceRepository.findOne({
where: {
id,
patient: { id: user.id },
},
relations: ['patient'],
});

if (!invoice) throw new NotFoundException('Invoice not found');

const amount = Number(invoice.amount);
if (isNaN(amount)) {
throw new InternalServerErrorException('Invalid amount format in invoice');
}
response.setHeader('Content-Type', 'application/pdf');
response.setHeader(
'Content-Disposition',
`attachment; filename=invoice-${id}.pdf`,
);
try {
const doc = new PDFDocument({ size: 'A4', margin: 50 });
doc.pipe(response);
doc
.fontSize(20)
.text('🏥 Hospital Invoice', { align: 'center' })
.moveDown();
doc.fontSize(14).text(`Invoice ID: ${invoice.id}`);
doc.text(
`Patient: ${invoice.patient.firstname} ${invoice.patient.lastname}`,
);
doc.text(`Date: ${invoice.createdAt.toDateString()}`);
doc.moveDown();
doc.text(`Amount: $${amount.toFixed(2)}`);
doc.text(`Status: ${invoice.status}`);
doc.end(); 
} catch (err) {
console.error('PDF generation error:', err);
throw new InternalServerErrorException('Failed to generate PDF');
}
}


}