import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
  OnGatewayInit,
  WsResponse,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Observable, from, map } from 'rxjs';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer()
  server: Server;
  constructor(private readonly chatService: ChatService) {}
  afterInit(server: any) {
    this.logger.log('Initialized');
  }
  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }
  async handleConnection(socket: Socket) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Client id: ${socket.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }
  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map((item) => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
  @SubscribeMessage('send_message')
  async listenForMessages(@MessageBody() content: string, @ConnectedSocket() socket: Socket) {
    const author = await this.chatService.getUserFromSocket(socket);

    this.server.sockets.emit('receive_message', {
      content,
      author,
    });
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(@ConnectedSocket() socket: Socket) {
    const author = await this.chatService.getUserFromSocket(socket);
    await this.chatService.getUserFromSocket(socket);
    const messages = await this.chatService.getAllMessages(author);
    socket.emit('send_all_messages', messages);
  }

  @SubscribeMessage('ping')
  handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'pong',
      data: 'Wrong data that will make the test fail',
    };
  }
}
