import {Injectable, OnInit} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Offer, Contract, InterestRate} from './objects';
import {DBSchema, DBTable, DBColumn, TableData} from './DBState.component';

import 'rxjs/add/operator/toPromise';


const APPLICATION_TYPE_JSON = new Headers({'Content-Type': 'application/json'});


export class AppState {
  NodeName: string;
  Peers: PeerNode[];
  LastBlock: string;
  LastBlockTime: string;
  Modules: string[];
}

export class PeerNode {
  ExternalAppPort: number;
  ExternalIpAddress: string;
  ExternalNodePort: number;
  NodeName: string;
  PubKey: string;
}

export class TableChange {
  rowHash: string[];
  tableHash: string;
  tableId: string;
}
export class WriteSet {
  WriteSetHash: string;
  tableChanges: TableChange[];
}

export class Transaction {
  AsOf: Number;
  WriteSet: WriteSet;
}


@Injectable()
export class BackendService implements OnInit {
  private listeners: Map<string, Array<Function>> = new Map<string, Array<Function>>();
  appState: AppState = new AppState();
  constructor(private http: Http) {}

  getSchema(): Promise<DBSchema> {
    // return Promise.resolve(offers);
    return this.http.get('/api/getSchema')
      .toPromise()
      .then(response => response.json() as DBSchema)
      .catch(this.handleError);
  }

  getTableData(tableName: string): Promise<TableData> {
    return this.http.get('/api/getTable/' + tableName)
      .toPromise()
      .then(response => response.json().returnValue as TableData)
      .catch(this.handleError);
  }

  getInterestRateList(): Promise<InterestRate[]> {
    // return Promise.resolve(offers);
    return this.http.get('/api/listInterestRates')
      .toPromise()
      .then(response => response.json() as InterestRate[])
      .catch(this.handleError);
  }

  getOffers(): Promise<Offer[]> {
    // return Promise.resolve(offers);
    return this.http.get('/api/listOffers')
      .toPromise()
      .then(response => response.json() as Offer[])
      .catch(this.handleError);
  }

  getContracts(): Promise<Contract[]> {
    // return Promise.resolve(offers);
    return this.http.get('/api/listContracts')
      .toPromise()
      .then(response => response.json() as Contract[])
      .catch(this.handleError);
  }

  getState(): AppState {
    return this.appState;
  }

  loadState(): Promise<AppState> {
    return this.http.get('/api/getState')
      .toPromise()
      .then(response => this.processStateResponse(response.json().returnValue as AppState))
      .catch(this.handleError);
  }

  loadHashData(): Promise<Transaction[]> {
    return this.http.get('/api/getLevelDBDump')
      .toPromise()
      .then(response => response.json().returnValue.Transactions as Transaction[])
      .catch(this.handleError);
  }

  getContractForPath(contractPath: string): Promise<Contract> {
    return this.http.get('/api/getContractDetails/' + contractPath)
      .toPromise()
      .then(response => response.json() as Contract)
      .catch(this.handleError);
  }

  processStateResponse(appState: AppState): AppState {
    this.appState.NodeName = appState.NodeName;
    this.appState.Peers = appState.Peers;
    this.appState.LastBlock = appState.LastBlock;
    this.appState.LastBlockTime = appState.LastBlockTime;
    return appState;
  }

  registerListener(eventName: string, func: Function) {
    let tmp: Array<Function> = this.listeners[eventName];
    if (tmp == null) {
      tmp = new Array<Function>();
      this.listeners[eventName] = tmp;
    }
    tmp.push(func);
  }

  fireEvent(eventName: string) {
    /*
    const tmp: Array<Function> = this.listeners[eventName];
    if (tmp != null) {
      for (const func of tmp) {
        func();
      }
    }
     */
  }

  toOfferArray(json: any): Offer[] {
    const rv: Offer[] = json as Offer[];
    return rv;
  }

  addNewOffer(o: Offer): Promise<any> {
    return this.http
      .post('/api/addOffer', JSON.stringify(o), {headers: APPLICATION_TYPE_JSON})
      .toPromise()
      .catch(this.handleError);
  }

  addNewRate(ir: InterestRate): Promise<any> {
    return this.http
      .post('/api/addInterestRate', JSON.stringify(ir), {headers: APPLICATION_TYPE_JSON})
      .toPromise()
      .catch(this.handleError);
  }

  checkForPayments(c: Contract): Promise<any> {
    const input: any = {
      'buyerId': c.buyerId,
      'sellerId': c.sellerId,
      'contractId': c.contractId
    };
    return this.http
      .post('/api/checkForPayments', JSON.stringify(input), {headers: APPLICATION_TYPE_JSON})
      .toPromise()
      .catch(this.handleError);
  }

  getOrgName(orgId: string): string {
    return orgId === this.appState.NodeName ? 'Self' : orgId;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  ngOnInit(): void {
    this.loadState();
  }

}
