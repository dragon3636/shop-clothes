import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Product from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>) {
  }
  async findAll() {
    return this.productsRepository.find()
  }
  async getAllBrands() {
    return this.productsRepository
      .query(`SELECT properties->'brand' as brand from product`);
  }

  async getBrand(productId: number) {
    return this.productsRepository
      .query(`SELECT properties->'brand' as brand from product WHERE id = $1`, [productId]);
  }

}
