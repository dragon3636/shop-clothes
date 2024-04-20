import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from './product.entity';
import { Repository } from 'typeorm';
import ILogger, { LoggerKey } from 'src/logger/interfaces/logger.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @Inject(LoggerKey) private logger: ILogger
  ) {
  }
  async findAll() {
    this.logger.startProfile('findAll');
    // Debug
    this.logger.debug(
      'I am a debug message!',
      {
        props: {
          foo: 'bar',
          baz: 'qux',
        },
      },
      'getHello',
    );


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
