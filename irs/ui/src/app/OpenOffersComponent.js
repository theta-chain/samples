"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var objects_1 = require("./objects");
var BackendService_1 = require("./BackendService");
var OpenOffersComponent = (function () {
    function OpenOffersComponent(backendService) {
        this.backendService = backendService;
        this.modalOffer = new objects_1.Offer();
        this.modalAction = null;
        this.offers = null;
    }
    OpenOffersComponent.prototype.newTrade = function () {
        var _this = this;
        var tmpOffer = new objects_1.Offer();
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
        this.showModal(tmpOffer, function (o) { return _this.addNewOffer(o); });
    };
    OpenOffersComponent.prototype.addNewOffer = function (o) {
        var _this = this;
        this.backendService.addNewOffer(o).then(function (o2) {
            var retVal = o2.json();
            // alert("return = "+JSON.stringify(retVal))
            if (retVal.status !== 'status') {
                alert(retVal.errorMessage);
            }
            _this.refreshOffers();
            _this.backendService.fireEvent('refreshAll');
        });
    };
    OpenOffersComponent.prototype.showModal = function (offer, modalAction) {
        Object.assign(this.modalOffer, offer);
        this.modalAction = modalAction;
        openDialog('#newTrade');
    };
    OpenOffersComponent.prototype.refreshOffers = function () {
        var _this = this;
        this.backendService.getOffers().then(function (offers) { return _this.processOffers(offers); });
    };
    OpenOffersComponent.prototype.processOffers = function (offers) {
        for (var _i = 0, offers_1 = offers; _i < offers_1.length; _i++) {
            var offer = offers_1[_i];
            offer.counterParty = this.getCounterParty(offer);
        }
        offers.sort(function (a, b) {
            return a.counterParty > b.counterParty ? 1 :
                (a.counterParty === b.counterParty ? 0 : -1);
        });
        this.offers = offers;
    };
    OpenOffersComponent.prototype.getCounterParty = function (offer) {
        return offer.buyerId === this.appState.NodeName ? offer.sellerId : offer.buyerId;
    };
    OpenOffersComponent.prototype.modalOK = function () {
        closeDialog('#newTrade');
        try {
            this.modalAction(this.modalOffer);
        }
        catch (e) {
            alert('Error ' + e);
        }
    };
    OpenOffersComponent.prototype.ngOnInit = function () {
        this.appState = this.backendService.getState();
        this.backendService.loadState();
        this.refreshOffers();
    };
    OpenOffersComponent.prototype.proposeEdits = function (offer) {
        var _this = this;
        offer.proposedBy = this.appState.NodeName;
        this.showModal(offer, function (o) { return _this.addNewOffer(o); });
    };
    return OpenOffersComponent;
}());
OpenOffersComponent = __decorate([
    core_1.Component({
        selector: 'open-offers',
        templateUrl: 'templates/open-offers.html'
    }),
    __metadata("design:paramtypes", [BackendService_1.BackendService])
], OpenOffersComponent);
exports.OpenOffersComponent = OpenOffersComponent;
function matches(o1, o2) {
    return o1.buyerId === o2.buyerId && o1.sellerId === o2.sellerId &&
        o1.contractId === o2.contractId;
}
//# sourceMappingURL=OpenOffersComponent.js.map