import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { ReviewService } from '../services/review.service';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';

@ApiBearerAuth()
@ApiTags('Review')
@Controller('review')
export class ReviewController {

constructor(
private readonly reviewService:ReviewService
){}


@Post('')
@ApiOperation({ summary: 'Create review' })
@UseGuards(AuthGuard)
@Roles(UserRole.PATIENT)
public async createReview(
@Body() data: CreateReviewDto,
) {
return await this.reviewService.createReview(data)
}


@Get('')
@ApiOperation({ summary: 'Get reviews' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getReviews(@Query() pagination: PaginationDto) {
return await this.reviewService.getReviews(pagination);
}

@Get(':id')
@ApiOperation({ summary: 'Get a review' })
public async getReview(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.reviewService.getReview(id)

}


@Put(':id')
@ApiOperation({ summary: 'Update a review' })
@UseGuards(AuthGuard)
@Roles(UserRole.PATIENT)
public async updateReview(
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateReviewDto,
) {
return  await this.reviewService.updateReview(
id,
data,
)
}


@Delete(':id')
@ApiOperation({ summary: 'Delete a review' })
@UseGuards(AuthGuard)
@Roles(UserRole.PATIENT)
public async deleteReview(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.reviewService.deleteReview(id)
}




}