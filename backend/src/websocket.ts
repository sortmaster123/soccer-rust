import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { GameBoard, MoveDirection, MoveResult } from './soccer-game-state/soccer-game-board';

type MoveRequest = {
  moveDirection: MoveDirection;
}

type MoveResponse = {
  moveResult: MoveResult;
  moveDirection: MoveDirection;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {

  constructor(private readonly gameBoard: GameBoard){
    console.log('initializing');
    this.gameBoard.initializeGame();
  }

  @WebSocketServer()
  server: Server;

    @SubscribeMessage('move')
    move(@MessageBody() data: MoveRequest): Observable<WsResponse<MoveResponse>> {
      console.log('received move event: ', data)
      let moveResult = this.gameBoard.move(data.moveDirection);
      return of(true).pipe(map(_ => ({ event: 'move', data: { moveResult, moveDirection: data.moveDirection }})));
    }
  
    // @SubscribeMessage('identity')
    // async identity(@MessageBody() data: number): Promise<number> {
    //   console.log('receved identity: ', data)
    //   return data + 5;
    // }
  }