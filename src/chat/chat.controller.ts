import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { ChatService } from './chat.service';

import JwtAuthenticationGuard from '@/authentication/jwt-authentication.guard';
import RequestWithUser from '@/authentication/requestWithUser.interface';

@Controller('chat')
export class ChatController {
  constructor(private readonly productsService: ChatService) {}

  @Get('all-messages')
  @UseGuards(JwtAuthenticationGuard)
  async findAllMessages(@Req() request: RequestWithUser) {
    const messages = await this.productsService.getAllMessages(request.user);
    return messages;
  }
}
