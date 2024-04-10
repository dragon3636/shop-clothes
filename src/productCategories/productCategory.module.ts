import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProductCategory from './productCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])
  ]
})
export class ProductCategoriesModule { }
