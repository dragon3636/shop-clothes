import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Address from './address.entity';
import PublicFile from 'src/files/entities/publicFile.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  password: string;

  @JoinColumn()
  @OneToOne(() => Address, { eager: true, cascade: true })
  public address: Address;

  @JoinColumn()
  @OneToOne(() => PublicFile, { eager: true, cascade: true })
  public avatar?: PublicFile;
}
export default User;
