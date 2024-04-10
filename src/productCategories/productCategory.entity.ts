import Product from 'src/products/product.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
class ProductCategory {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @OneToMany(() => Product, (product: Product) => product.category)
  public products: Product[];
}

export default ProductCategory;