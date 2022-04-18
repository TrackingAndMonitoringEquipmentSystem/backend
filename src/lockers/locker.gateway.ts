import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Locker } from './entities/locker.entity';
@WebSocketGateway({ cors: true, namespace: '/locker' })
export class LockerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('LockerGateway');
  private addEquipmentResponseResolves: Record<number, (data)=>void> = {};
  afterInit(server: any) {
    this.logger.log('initialized');
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client}`);
  }
  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client}`);
  }
  emitLocketUpdate(locker: Locker) {
    console.log('->emitLocketUpdate:', locker);
    this.server.emit(`locker/${locker.locker_id}`, {command: 'lockerUpdate', data: locker});
  }
  async addEquipment(lockerId: number): Promise<any> {
    console.log('->emitLocketUpdate:', lockerId); 
    this.server.emit(`locker/${lockerId}`, {command: 'addEquipment'});
    return new Promise(((resolve,reject) => {
      this.addEquipmentResponseResolves[lockerId] = resolve;
    }).bind(this));

  }

  @SubscribeMessage('locker/addEquipment/response') 
  lockerResponse(@MessageBody() data: any){
    console.log('->data:', data);
    this.addEquipmentResponseResolves[data.id](data.data);

  }
}
