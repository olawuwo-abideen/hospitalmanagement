import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../shared/entities/user.entity';
import { Review } from '../../../shared/entities/review.entity';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';

@Injectable()
export class ReviewService {

constructor(
@InjectRepository(Review)
private readonly reviewRepository: Repository<Review>,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
) {}

public async createReview(data: CreateReviewDto): Promise<{ message: string; review: Review }> {
const review = this.reviewRepository.create({
rating: data.rating,
comment: data.comment
});
const savedReview = await this.reviewRepository.save(review);
return { message: 'Review created successfully', review: savedReview };
}


public async updateReview(id: string, data: UpdateReviewDto): Promise<{ message: string; review: Review }> {
const updateResult = await this.reviewRepository.update(id, data);
if (updateResult.affected === 0) {
throw new NotFoundException(`Review with ID ${id} not found`);
}
const updatedReview = await this.reviewRepository.findOne({ where: { id } });
return { message: 'Review updated successfully', review: updatedReview };
}


public async deleteReview(id: string): Promise<{ message: string }> {
const review = await this.reviewRepository.findOne({ where: { id } });
if (!review) {
throw new NotFoundException(`Review with ID ${id} not found`);
}
await this.reviewRepository.delete(id);
return { message: 'Review deleted successfully' };
}



public async getReviews(pagination: PaginationDto): Promise<{ message: string; data: Review[] }> {
const { page = 1, pageSize = 10 } = pagination;

const [data] = await this.reviewRepository.findAndCount({
skip: (page - 1) * pageSize,
take: pageSize,
});

return { message: 'Reviews retrieved successfully', data };
}


public async getReview(id: string): Promise<{ message: string; review: Review }> {
const review = await this.reviewRepository.findOne({ where: { id } });
if (!review) {
throw new NotFoundException(`Review with ${id} not found`);
}

return { message: 'Review retrieved successfully', review };
}




}