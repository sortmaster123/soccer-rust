import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GameState } from '../store/game-state';

@Component({
  selector: 'app-player-label',
  templateUrl: './player-label.component.html',
  styleUrls: ['./player-label.component.scss']
})
export class PlayerLabelComponent {
  @Select(GameState.playerOnTheMove)
  playerOnTheMove$: Observable<string>;
}
