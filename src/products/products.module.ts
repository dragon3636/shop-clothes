import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Product from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { LoggerModule } from '@/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
