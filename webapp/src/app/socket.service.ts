import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { MoveDirection } from './pitch/pitch.component';

type MoveResponse = {
  moveResult: MoveResult;
}

export enum MoveResult {
  AlreadyTaken,
  Moved,
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() { 
    this.socket = io('http://localhost:3000');
  }

  private readonly socket: Socket;

  connect() {
    let socket = this.socket;
    
    // socket.on('connect', function() {
    //   console.log('pitch Connected');

    //   socket.emit('events', { test: 'test23' });
    //   // socket.emit('identity', 145, response =>
    //   //   console.log('Identity:', response),
    //   // );
    // });
    // socket.on('events', function(data) {
    //   console.log('socket events', data);
    // });

    socket.on('move', function(data) {
      let parsedData = data as MoveResponse;
      console.log('move result: ', data);
      console.log('move result: ', parsedData);
      console.log('move failure: ', parsedData.moveResult == MoveResult.AlreadyTaken);
      console.log('move success: ', parsedData.moveResult == MoveResult.Moved);
    });

    socket.on('exception', function(data) {
      console.log('socket event', data);
    });
    socket.on('disconnect', function() {
      console.log('pitch Disconnected');
    });
  }

  tryMove(movedir: MoveDirection) {
    this.socket.emit('move', {moveDirection: movedir});
  }
}
