import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import {Point} from '../pitch/pitch.component';
import { AcceptMove, InitializeGame } from './game-state.actions';

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

  @Action(AcceptMove)
  acceptMove(ctx: StateContext<GameStateModel>, action: AcceptMove) {}

}