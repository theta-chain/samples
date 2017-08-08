import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {InterestRate} from './objects';
import {BackendService} from './BackendService';

@Component({
  selector: 'int-rate-dialog',
  templateUrl: 'templates/int-rate-dialog.html'
})
export class InterestRateDlgComponent {
  interestRate: InterestRate = null;
  dataChannel: any = null;
  showProgress = false;
  constructor(private backendService: BackendService, @Inject(MD_DIALOG_DATA) public data: any) {
    this.interestRate = data.rate;
    this.dataChannel = data;
  }

  addInterestRate(): void {
    this.addNewRate(this.interestRate);
  }

  addNewRate(o: InterestRate) {
    this.showProgress = true;
    this.backendService.addNewRate(o).then((o2: any) => {
      this.dataChannel.dialogRef.close(true);
      this.backendService.fireEvent('refreshAll');
      this.showProgress = false;
    });
  }

}
