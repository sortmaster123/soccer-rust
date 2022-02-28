import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import {MoveDirection } from '../pitch/pitch.component';
import { MoveResult, SocketService } from '../socket.service';
import { DeclareWin, DrawMove, InitializeGame, KeyPressed, ReceiveMove, SendMoveRequest } from './game-state.actions';

export type GameStateModel = {
    playerOnTheMove: 'P1OnTheMove' | 'P2OnTheMove';
    socketConneted: boolean;
}

@State<GameStateModel>({
  name: 'game',
  defaults: {
    playerOnTheMove: 'P1OnTheMove',
    socketConneted: false,
  }
})
@Injectable()
export class GameState {
  constructor(private socketService: SocketService) {
  }

  @Selector()
  static playerOnTheMove(state: GameStateModel) {
    return state.playerOnTheMove;
  }

  @Action(InitializeGame)
  initializeGame(ctx: StateContext<GameStateModel>) {
    ctx.patchState({
      playerOnTheMove: 'P1OnTheMove',
    });
  }

  @Action(KeyPressed)
  keyPressed(ctx: StateContext<GameStateModel>, { key }: KeyPressed){

    switch(key) {
      case 'ArrowDown':
        return ctx.dispatch(new SendMoveRequest(MoveDirection.Down));
      case 'ArrowUp':
        return ctx.dispatch(new SendMoveRequest(MoveDirection.Up));
      case 'ArrowLeft':
        return ctx.dispatch(new SendMoveRequest(MoveDirection.Left));
      case 'ArrowRight':
        return ctx.dispatch(new SendMoveRequest(MoveDirection.Right));
      case 'PageDown':
        return ctx.dispatch(new SendMoveRequest(MoveDirection.DownRight));
      case 'PageUp':
        return ctx.dispatch(new SendMoveRequest(MoveDirection.UpRight));
      case 'End':
        return ctx.dispatch(new SendMoveRequest((MoveDirection.DownLeft)));
      case 'Home':
        return ctx.dispatch(new SendMoveRequest(MoveDirection.UpLeft));
    }
    return of(undefined);
  }

  @Action(SendMoveRequest)
  sendMoveRequest(ctx: StateContext<GameStateModel>, { moveDirection }: SendMoveRequest){

    if(!ctx.getState().socketConneted){
      this.socketService.connect();
      this.socketService.requestNewGame();
      ctx.patchState({
        socketConneted: true
      });
    }

    this.socketService.tryMove(moveDirection);
  }

  @Action(ReceiveMove)
  receiveMove(ctx: StateContext<GameStateModel>, action: ReceiveMove) {
    if(action.moveResponse.moveResult == MoveResult.Moved){
      ctx.dispatch(new DrawMove(action.moveResponse.moveDirection));
    }

    if(action.moveResponse.gameState == 'P1Win' || action.moveResponse.gameState == 'P2Win'){
      ctx.dispatch(new DeclareWin());
    }
    else{
      ctx.patchState({
        playerOnTheMove: action.moveResponse.gameState,
      });
    }
  }

  @Action(DrawMove)
  acceptMove(ctx: StateContext<GameStateModel>, action: DrawMove) {}

  @Action(DeclareWin)
  declareWin() {
    alert('somebody won!');
  }

}