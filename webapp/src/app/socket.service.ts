import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { io, Socket } from 'socket.io-client';
import { MoveDirection } from './pitch/pitch.component';
import { ReceiveMove } from './store/game-state.actions';

export enum GameResult {
  SwitchPlayers = 'SwitchPlayers',
  ContinueMove = 'ContinueMove',
  P1Win = 'P1Win',
  P2Win = 'P2Win',
}

export type MoveResponse = {
  moveResult: MoveResult;
  moveDirection: MoveDirection;
  gameState: GameResult;
}

export enum MoveResult {
  AlreadyTaken = 'AlreadyTaken',
  Moved = 'Moved',
  InvalidMove = 'InvalidMove',
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    private readonly store: Store,
  ) { 
    this.socket = io('http://localhost:3000');
  }

  private readonly socket: Socket;

  connect() {
    let socket = this.socket;
    let store = this.store;

    socket.on('move', function(data) {
      store.dispatch(new ReceiveMove(data as MoveResponse));
    });

    socket.on('exception', function(data) {
      console.log('socket event', data);
    });
    socket.on('disconnect', function() {
      console.log('pitch Disconnected');
    });
  }

  tryMove(movedir: MoveDirection) {
    console.log('sending move request: ', movedir);
    this.socket.emit('move', {moveDirection: movedir});
  }

  requestNewGame() {
    this.socket.emit('newgame');
  }
}
