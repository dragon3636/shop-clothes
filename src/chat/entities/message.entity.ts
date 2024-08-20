import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import GroupChat from './group-chat.entity';

import User from '@/users/user.entity';

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @ManyToOne(() => User)
  public author: User;

  @OneToOne(() => GroupChat)
  group: GroupChat;
}

export default Message;
