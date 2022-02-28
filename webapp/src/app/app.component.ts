import { Component, HostListener } from '@angular/core';
import { Store } from '@ngxs/store';
import { KeyPressed } from './store/game-state.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private readonly store: Store) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log('key pressed')
    this.store.dispatch(new KeyPressed(event.key));
  }
}
