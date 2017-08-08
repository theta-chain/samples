import { Component, OnInit } from '@angular/core';
import { BackendService, AppState } from './BackendService';
@Component({
  selector: 'my-app',
  templateUrl: 'templates/app.html',
})
export class AppComponent implements OnInit {
  title = 'Theta-Chain Demo';
  appState: AppState = null;
  constructor(private backendService: BackendService) { }


  ngOnInit(): void {
    this.appState = this.backendService.appState;
  }
}
