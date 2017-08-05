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
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var APPLICATION_TYPE_JSON = new http_1.Headers({ 'Content-Type': 'application/json' });
var BackendService = (function () {
    function BackendService(http) {
        this.http = http;
        this.listeners = new Map();
        this.appState = new AppState();
    }
    BackendService.prototype.getSchema = function () {
        // return Promise.resolve(offers);
        return this.http.get('/api/getSchema')
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    BackendService.prototype.getTableData = function (tableName) {
        return this.http.get('/api/getTable/' + tableName)
            .toPromise()
            .then(function (response) { return response.json().returnValue; })
            .catch(this.handleError);
    };
    BackendService.prototype.getOffers = function () {
        // return Promise.resolve(offers);
        return this.http.get('/api/listOffers')
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    BackendService.prototype.getContracts = function () {
        // return Promise.resolve(offers);
        return this.http.get('/api/listContracts')
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    BackendService.prototype.getState = function () {
        return this.appState;
    };
    BackendService.prototype.loadState = function () {
        var _this = this;
        return this.http.get('/api/getState')
            .toPromise()
            .then(function (response) { return _this.processStateResponse(response.json().returnValue); })
            .catch(this.handleError);
    };
    BackendService.prototype.loadHashData = function () {
        return this.http.get('/api/getLevelDBDump')
            .toPromise()
            .then(function (response) { return response.json().returnValue.Transactions; })
            .catch(this.handleError);
    };
    BackendService.prototype.processStateResponse = function (appState) {
        this.appState.NodeName = appState.NodeName;
        this.appState.Peers = appState.Peers;
        this.appState.LastBlock = appState.LastBlock;
        this.appState.LastBlockTime = appState.LastBlockTime;
        return appState;
    };
    BackendService.prototype.registerListener = function (eventName, func) {
        var tmp = this.listeners[eventName];
        if (tmp == null) {
            tmp = new Array();
            this.listeners[eventName] = tmp;
        }
        tmp.push(func);
    };
    BackendService.prototype.fireEvent = function (eventName) {
        var tmp = this.listeners[eventName];
        if (tmp != null) {
            for (var _i = 0, tmp_1 = tmp; _i < tmp_1.length; _i++) {
                var func = tmp_1[_i];
                func();
            }
        }
    };
    BackendService.prototype.toOfferArray = function (json) {
        var rv = json;
        return rv;
    };
    BackendService.prototype.addNewOffer = function (o) {
        return this.http
            .post('/api/addOffer', JSON.stringify(o), { headers: APPLICATION_TYPE_JSON })
            .toPromise()
            .catch(this.handleError);
    };
    BackendService.prototype.getOrgName = function (orgId) {
        return orgId === this.appState.NodeName ? 'Self' : orgId;
    };
    BackendService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    BackendService.prototype.ngOnInit = function () {
        this.loadState();
    };
    return BackendService;
}());
BackendService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], BackendService);
exports.BackendService = BackendService;
var AppState = (function () {
    function AppState() {
    }
    return AppState;
}());
exports.AppState = AppState;
var PeerNode = (function () {
    function PeerNode() {
    }
    return PeerNode;
}());
exports.PeerNode = PeerNode;
var TableChange = (function () {
    function TableChange() {
    }
    return TableChange;
}());
exports.TableChange = TableChange;
var WriteSet = (function () {
    function WriteSet() {
    }
    return WriteSet;
}());
exports.WriteSet = WriteSet;
var Transaction = (function () {
    function Transaction() {
    }
    return Transaction;
}());
exports.Transaction = Transaction;
//# sourceMappingURL=BackendService.js.map