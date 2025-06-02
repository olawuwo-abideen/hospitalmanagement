import { Module } from '@nestjs/common';
import { ReviewController } from './controllers/review.controller';
import { ReviewService } from './services/review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/shared/entities/review.entity';
import { User } from 'src/shared/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
TypeOrmModule.forFeature([User, Review]),
JwtModule.register({}),
UserModule,
AuthModule
],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
