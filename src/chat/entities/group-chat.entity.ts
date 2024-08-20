import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import User from '@/users/user.entity';

@Entity()
class GroupChat {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToMany(() => User, (groups) => groups.id)
  @JoinTable({
    name: 'group_memebers', // table name for the junction table of this relation
    joinColumn: {
      name: 'group',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'member',
      referencedColumnName: 'id',
    },
  })
  members: User[];
  @OneToOne((type) => User)
  admin: User;
}

export default GroupChat;
