import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import {Point} from '../pitch/pitch.component';
import { GameResult, MoveResult } from '../socket.service';
import { DeclareWin, DrawMove, InitializeGame, ReceiveMove } from './game-state.actions';

export type GameStateModel = {
    currentPosition: Point;
}

@State<GameStateModel>({
  name: 'game',
})
@Injectable()
export class GameState {

  @Action(InitializeGame)
  initializeGame(ctx: StateContext<GameStateModel>) {
    ctx.setState({
      currentPosition: {x: 4, y: 5},
    });
  }

  @Action(ReceiveMove)
  receiveMove(ctx: StateContext<GameStateModel>, action: ReceiveMove) {
    console.log('received move: ', action)
    if(action.moveResponse.moveResult == MoveResult.Moved){
      ctx.dispatch(new DrawMove(action.moveResponse.moveDirection));
    }

    console.log('log', action.moveResponse.gameState)

    if(action.moveResponse.gameState == GameResult.P1Win || action.moveResponse.gameState == GameResult.P2Win){
      console.log('declaring a win!')
      ctx.dispatch(new DeclareWin());
    }
  }

  @Action(DrawMove)
  acceptMove(ctx: StateContext<GameStateModel>, action: DrawMove) {}

  @Action(DeclareWin)
  declareWin() {
    alert('somebody won!');
  }

}