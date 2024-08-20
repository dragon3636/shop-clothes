import { Category } from 'aws-sdk/clients/cloudformation';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Address from './address.entity';
import Role from './role.enum';

import GroupChat from '@/chat/entities/group-chat.entity';
import PublicFile from '@/files/entities/publicFile.entity';
import { Post } from '@/post/entities/post.entity';
import PrivateFile from '@/private-file/privateFile.entity';

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

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @JoinColumn()
  @OneToOne(() => Address, { eager: true, cascade: true })
  public address: Address;

  @JoinColumn()
  @OneToOne(() => PublicFile, { eager: true, cascade: true })
  public avatar?: PublicFile;
  @OneToMany(() => Post, (post: Post) => post.author)
  public posts?: Post[];

  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.id)
  public files?: PrivateFile[];

  @ManyToMany((type) => GroupChat)
  @JoinTable({
    name: 'group_memebers', // table name for the junction table of this relation
    joinColumn: {
      name: 'member',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'group',
      referencedColumnName: 'id',
    },
  })
  groups?: GroupChat[];

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User],
  })
  public roles: Role[];
}
export default User;
