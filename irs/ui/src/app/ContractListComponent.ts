import {Component, OnInit} from '@angular/core';
import {BackendService} from './BackendService';
import {Contract} from './objects';

@Component({
  selector: 'contracts',
  templateUrl: 'templates/contracts.html'
})
export class ContractListComponent implements OnInit {
  contracts: Contract[] = [];

  constructor(private backendService: BackendService) {}

  refreshContracts(): void {
    this.backendService.getContracts().then(contracts => this.contracts = contracts);
  }


  ngOnInit(): void {
    this.refreshContracts();
    this.backendService.registerListener('refreshAll', () => this.refreshContracts());
  }

  navDetails(contract: Contract): void {
    const contractPath: string = contract.contractId + ':' + contract.buyerId + ':' + contract.sellerId;
    window.location.href = '/#/contract/' + contractPath;
  }
}
