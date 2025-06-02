  import { Injectable, NotFoundException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { AvailabilitySlot } from '../../../shared/entities/availabilityslot.entity';
  import { SetAvailabilityDto, UpdateAvailabilityDto } from '../dto/availabilityslot.dto';
  import { User } from '../../../shared/entities/user.entity';

  @Injectable()
  export class AvailabilitySlotService {
  constructor(
  @InjectRepository(AvailabilitySlot)
  private readonly availabilitySlotRepository: Repository<AvailabilitySlot>,
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  ) {}

  async setAvailabilitySlot(
  user: User,
  data: SetAvailabilityDto
  ): Promise<{ message: string; availability: AvailabilitySlot }> {
  const availability = this.availabilitySlotRepository.create({
  user: { id: user.id }, 
  startTime: data.startTime,
  endTime: data.endTime,
  isAvailable: data.isAvailable,
  });

  const savedAvailability = await this.availabilitySlotRepository.save(availability);

  return {
  message: 'Availability slot created successfully',
  availability: savedAvailability,
  };
  }

  async getAvailabilitySlots(user: User): Promise<{ message: string; availabilitySlots: AvailabilitySlot[] }> {
  const slots = await this.availabilitySlotRepository.find({
  where: { user: { id: user.id } }, 
  });

  return {
  message: slots.length > 0 ? 'Availability slots retrieved successfully' : 'No availability slots found',
  availabilitySlots: slots,
  };
  }


  async getAvailabilityslot(
  user: User,
  id: string
  ): Promise<{ message: string; availabilitySlot?: AvailabilitySlot }> {
  const slot = await this.availabilitySlotRepository.findOne({
  where: { id, user: { id: user.id } },
  });

  if (!slot) {
  return { message: 'Availability slot not found' };
  }

  return { message: 'Availability slot retrieved successfully', 
  availabilitySlot: slot };
  }


  async updateAvailabilitySlot(
  user: User,
  id: string,
  data: UpdateAvailabilityDto
  ): Promise<{ message: string; availabilitySlot: AvailabilitySlot }> {
  const availabilitySlot = await this.availabilitySlotRepository.findOne({
  where: { id, user: { id: user.id } }, 
  });

  if (!availabilitySlot) {
  throw new NotFoundException('Availability slot not found ');
  }

  Object.assign(availabilitySlot, {
  startTime: data.startTime ?? availabilitySlot.startTime,
  endTime: data.endTime ?? availabilitySlot.endTime,
  isAvailable: data.isAvailable ?? availabilitySlot.isAvailable,
  });

  const updatedSlot = await this.availabilitySlotRepository.save(availabilitySlot);

  return {
  message: 'Availability slot updated successfully',
  availabilitySlot: updatedSlot,
  };
  }


  async deleteAvailabilitySlot(user: User, id: string): Promise<{ message: string }> {
  const availabilitySlot = await this.availabilitySlotRepository.findOne({
  where: { id, user: { id: user.id } }, 
  });

  if (!availabilitySlot) {
  throw new NotFoundException('Availability slot not found');
  }

  await this.availabilitySlotRepository.remove(availabilitySlot);

  return { message: 'Availability slot deleted successfully' };
  }

  }
