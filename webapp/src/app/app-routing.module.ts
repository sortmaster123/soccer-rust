import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameInProgressComponent } from './game-in-progress/game-in-progress.component';

const routes: Routes = [
  { path: 'pitch', component: GameInProgressComponent },
  { path: '**', redirectTo: '/pitch' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
