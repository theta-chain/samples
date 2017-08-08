import {Component, OnInit} from '@angular/core';
import {InterestRate} from './objects';
import {BackendService, AppState} from './BackendService';
import {MdDatepickerModule, MdDialog, MdButtonModule} from '@angular/material';
import {InterestRateDlgComponent} from './InterestRateDlgComponent';

declare function openDialog(dialogName: string): any;
declare function closeDialog(dialogName: string): any;


@Component({
  selector: 'irs-demo',
  templateUrl: 'templates/interest-rates-view.html',
})
export class InterestRatesComponent implements OnInit {
  modalRate: InterestRate = new InterestRate();
  modalAction: Function = null;
  appState: AppState;
  knownRates: InterestRate[] = null;
  constructor(private backendService: BackendService, private dialog: MdDialog) {}

  newRate(): void {
    const tmpRate: InterestRate = new InterestRate();
    tmpRate.indexName = 'LIBOR';
    tmpRate.period = 'Monthly';
    tmpRate.interestRate = 1.543;
    tmpRate.validForDate = new Date('08/01/2016');
    const dataChannel: any = {
      'rate': tmpRate
    };
    const dialogRef = this.dialog.open(InterestRateDlgComponent, {
      data: dataChannel
    });
    dataChannel.dialogRef = dialogRef;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshRates();
      }
    });
  }

  refreshRates(): void {
    this.backendService.getInterestRateList().then(offers => this.processRates(offers));
  }

  processRates(rates: InterestRate[]): void {
    this.knownRates = rates;
  }

  modalOK(): void {
    closeDialog('#newRate');
    try {
      this.modalAction(this.modalRate);
    } catch (e) {
      alert('Error ' + e);
    }
  }

  ngOnInit(): void {
    this.appState = this.backendService.getState();
    this.backendService.loadState();
    this.refreshRates();
  }

}



