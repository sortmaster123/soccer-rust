import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PitchComponent } from './pitch/pitch.component';

const routes: Routes = [
  { path: 'pitch', component: PitchComponent },
  { path: '**', redirectTo: '/pitch' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
