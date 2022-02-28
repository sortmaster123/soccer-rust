import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {Point} from '../pitch/pitch.component';
import { MoveResult } from '../socket.service';
import { DeclareWin, DrawMove, InitializeGame, ReceiveMove } from './game-state.actions';

export type GameStateModel = {
    currentPosition: Point;
    playerOnTheMove: 'P1OnTheMove' | 'P2OnTheMove';
}

@State<GameStateModel>({
  name: 'game',
})
@Injectable()
export class GameState {

  @Selector()
  static playerOnTheMove(state: GameStateModel) {
    return state.playerOnTheMove;
  }

  @Action(InitializeGame)
  initializeGame(ctx: StateContext<GameStateModel>) {
    ctx.setState({
      currentPosition: {x: 4, y: 5},
      playerOnTheMove: 'P1OnTheMove',
    });
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