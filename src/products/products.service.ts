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
    try {
      const result = await this.productsRepository.find();
      this.logger.debug(
        'I am a debug message!',
        {
          props: {
            foo: 'bar',
            baz: 'qux',
          },
        })
      this.logger.info('data test')
      this.logger.info('data test')
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async getAllBrands() {
    return await this.productsRepository
      .query(`SELECT properties->'brand' as brand from product`);
  }

  async getProductById(productId: number) {
    this.logger.startProfile('getProductById');
    this.logger.info('productId', { props: { productId } })

    try {
      return await this.productsRepository
        .query(`SELECT properties->'brand' as brand from product WHERE id = $1`, [productId]);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

}
