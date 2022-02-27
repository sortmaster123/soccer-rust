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
import { GameBoard, GameResult, MoveDirection, MoveResult } from './soccer-game-state/soccer-game-board';

type MoveRequest = {
  moveDirection: MoveDirection;
}

type MoveResponse = {
  moveResult: MoveResult;
  moveDirection: MoveDirection;
  gameState: GameResult;
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
    let moveResult = this.gameBoard.move(data.moveDirection);
    return of(true).pipe(map(_ => ({ event: 'move', data: { ...moveResult, moveDirection: data.moveDirection }})));
  }

  @SubscribeMessage('newgame')
  newgame(@MessageBody() data: any): Observable<WsResponse<boolean>> {
    this.gameBoard.initializeGame();
    console.log('new game requestsed');
    return of(true).pipe(map(_ => ({ event: 'newgame', data: true})));
  }
  
    // @SubscribeMessage('identity')
    // async identity(@MessageBody() data: number): Promise<number> {
    //   console.log('receved identity: ', data)
    //   return data + 5;
    // }
  }