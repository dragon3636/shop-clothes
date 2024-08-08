import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import Message from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import GroupChat from './entities/group-chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, GroupChat]), AuthenticationModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
