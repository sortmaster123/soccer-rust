import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PitchComponent } from './pitch/pitch.component';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { GameState } from './store/game-state';
import { PlayerLabelComponent } from './player-label/player-label.component';
import { GameInProgressComponent } from './game-in-progress/game-in-progress.component';

@NgModule({
  declarations: [
    AppComponent,
    PitchComponent,
    PlayerLabelComponent,
    GameInProgressComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxsModule.forRoot([GameState], {
      developmentMode: !environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
