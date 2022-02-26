import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(httpClient: HttpClient) {
    httpClient.get('http://localhost:3000').pipe(
      tap(result => console.log(result)),
    ).subscribe()
  }


}
