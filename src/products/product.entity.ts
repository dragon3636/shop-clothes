import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { BookProperties } from './types/bookProperties.interface';
import { CarProperties } from './types/carProperties.interface';
import ProductCategory from '../productCategories/productCategory.entity';

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(() => ProductCategory, (category: ProductCategory) => category.products)
  public category: ProductCategory;

  @Column({
    type: 'jsonb',
  })
  public properties: CarProperties | BookProperties;
}

export default Product;
