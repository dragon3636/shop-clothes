import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import GroupChat from './entities/group-chat.entity';
import Message from './entities/message.entity';

import { AuthenticationModule } from '@/authentication/authentication.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, GroupChat]), AuthenticationModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
