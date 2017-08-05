import { Component, OnInit } from '@angular/core';
import { Offer } from './objects';
import { BackendService, AppState } from './BackendService';

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
  constructor(private backendService: BackendService) { }

  newTrade(): void {
    let tmpOffer: Offer = new Offer();
    tmpOffer.buyerId = '';
    tmpOffer.sellerId = '';
    tmpOffer.contractId = '0';
    tmpOffer.couponFreq = 'Monthly';
    tmpOffer.fixedLegRate = '3.5';
    tmpOffer.floatingRateIndex = 'LIBOR';
    tmpOffer.maturityDate = '2017-06-30';
    tmpOffer.startDate = '2016-07-01';
    tmpOffer.proposedBy = this.appState.NodeName;
    tmpOffer.notionalAmount = '10000000';
    tmpOffer.spread = '0.5';
    tmpOffer.status = 'OPEN';
    this.showModal(tmpOffer, (o: Offer) => this.addNewOffer(o));
  }

  addNewOffer(o: Offer) {
    this.backendService.addNewOffer(o).then((o2: any) => {
      let retVal: any = o2.json();
      // alert("return = "+JSON.stringify(retVal))
      if (retVal.status !== 'status') {
        alert(retVal.errorMessage);
      }
      this.refreshOffers();
      this.backendService.fireEvent('refreshAll');
    });
  }


  showModal(offer: Offer, modalAction: Function): void {
    Object.assign(this.modalOffer, offer);
    this.modalAction = modalAction;
    openDialog('#newTrade');
  }

  refreshOffers(): void {
    this.backendService.getOffers().then(offers => this.processOffers(offers));
  }

  processOffers(offers: Offer[]): void {
    for (let offer of offers) {
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
    offer.proposedBy = this.appState.NodeName;
    this.showModal(offer, (o: Offer) => this.addNewOffer(o));
  }
}


function matches(o1: Offer, o2: Offer): boolean {
  return o1.buyerId === o2.buyerId && o1.sellerId === o2.sellerId &&
    o1.contractId === o2.contractId;
}


