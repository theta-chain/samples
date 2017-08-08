import {Component, OnInit} from '@angular/core';
import {Offer} from './objects';
import {BackendService, AppState} from './BackendService';
import {OfferDlgComponent} from './OfferDlgComponent';
import {MdDatepickerModule, MdDialog, MdButtonModule} from '@angular/material';

declare function openDialog(dialogName: string): any;
declare function closeDialog(dialogName: string): any;

@Component({
  selector: 'open-offers',
  templateUrl: 'templates/open-offers.html'
})
export class OpenOffersComponent implements OnInit {
  modalOffer: Offer = new Offer();
  modalAction: Function = null;
  appState: AppState;
  offers: Offer[] = null;
  constructor(private backendService: BackendService, private dialog: MdDialog) {}

  newTrade(): void {
    const tmpOffer: Offer = new Offer();
    tmpOffer.buyerId = '';
    tmpOffer.sellerId = '';
    tmpOffer.contractId = '0';
    tmpOffer.couponFreq = 'Monthly';
    tmpOffer.fixedLegRate = '3.5';
    tmpOffer.floatingRateIndex = 'LIBOR';
    tmpOffer.maturityDate = new Date('06/30/2017');
    tmpOffer.startDate = new Date('07/01/2016');
    tmpOffer.proposedBy = this.appState.NodeName;
    tmpOffer.notionalAmount = '10000000';
    tmpOffer.spread = '0.5';
    tmpOffer.status = 'OPEN';
    this.showModal(tmpOffer);
  }


  showModal(offer: Offer): void {
    const dataChannel: any = {
      'offer': offer,
      'peers': this.appState.Peers
    };
    const dialogRef = this.dialog.open(OfferDlgComponent, {
      data: dataChannel
    });
    dataChannel.dialogRef = dialogRef;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshOffers();
        this.backendService.fireEvent('refreshAll');
      }
    });
  }

  refreshOffers(): void {
    this.backendService.getOffers().then(offers => this.processOffers(offers));
  }

  processOffers(offers: Offer[]): void {
    for (const offer of offers) {
      offer.counterParty = this.getCounterParty(offer);
    }
    offers.sort((a: Offer, b: Offer): number => {
      return a.counterParty > b.counterParty ? 1 :
        (a.counterParty === b.counterParty ? 0 : -1);
    });
    this.offers = offers;
  }

  getCounterParty(offer: Offer) {
    return offer.buyerId === this.appState.NodeName ? offer.sellerId : offer.buyerId;
  }
  modalOK(): void {
    closeDialog('#newTrade');
    try {
      this.modalAction(this.modalOffer);
    } catch (e) {
      alert('Error ' + e);
    }
  }

  ngOnInit(): void {
    this.appState = this.backendService.getState();
    this.backendService.loadState();
    this.refreshOffers();
  }
  proposeEdits(offer: Offer): void {
    const tmpOffer: Offer = Object.assign({}, offer);
    tmpOffer.proposedBy = this.appState.NodeName;
    this.showModal(tmpOffer);
  }
}


function matches(o1: Offer, o2: Offer): boolean {
  return o1.buyerId === o2.buyerId && o1.sellerId === o2.sellerId &&
    o1.contractId === o2.contractId;
}


