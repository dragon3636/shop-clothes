import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import Product from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
