import { Component, OnInit } from '@angular/core';
import { BackendService, AppState } from './BackendService';


@Component({
  selector: 'sys-state',
  templateUrl: 'templates/sys-state.html',
})
export class SystemStateComponent implements OnInit {
  name = 'System State';
  appState: AppState ;
  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.loadState().then(state =>
      this.appState = state
    );
  }

}
