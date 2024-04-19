import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Product from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>) {
  }
  async findAll() {
    this.logger.log('Doing something...');
    this.logger.error(
      'This is an ERROR log message from the LoggerController.')
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
