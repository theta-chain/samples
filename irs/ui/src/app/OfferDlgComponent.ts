import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {Offer} from './objects';
import {PeerNode, BackendService} from './BackendService';

@Component({
  selector: 'offer-dialog',
  templateUrl: 'templates/offer-dialog.html'
})
export class OfferDlgComponent {
  modalOffer: Offer = null;
  peers: PeerNode[] = [];
  dataChannel: any;
  showProgress = false;

  constructor(private backendService: BackendService, @Inject(MD_DIALOG_DATA) public data: any) {
    this.modalOffer = data['offer'];
    this.peers = data['peers'];
    this.dataChannel = data;
  }

  addNewOffer() {
    this.showProgress = true;
    this.backendService.addNewOffer(this.modalOffer).then((o2: any) => {
      this.dataChannel.dialogRef.close(true);
      this.backendService.fireEvent('refreshAll');
      this.showProgress = false;
    });
  }


}
