import {Component, OnInit} from '@angular/core';
import {BackendService, AppState, Transaction} from './BackendService';

@Component({
  selector: 'db-state',
  templateUrl: 'templates/db-state.html',
})
export class DBStateComponent implements OnInit {
  schema: DBSchema;
  name = 'DB State';
  selectedTableName: string = null;
  tableData: TableData = null;
  appState: AppState;
  transactionHashData: Transaction[];


  constructor(private backendService: BackendService) {}

  refreshSchema(): void {
    this.backendService.loadState().then(state =>
      this.appState = state
    );
    this.backendService.getSchema().then(schema =>
      this.schema = schema
    );
  }

  ngOnInit(): void {
    this.refreshSchema();
  }

  loadData(): void {
    this.backendService.getTableData(this.selectedTableName).then(data => this.tableData = data);
  }

  reloadHashes(): void {
    this.backendService.loadHashData().then(data =>
      this.transactionHashData = data);
  }
  jstring(obj: any): string {
    if (obj == null) {
      return '';
    } else {
      return JSON.stringify(obj);
    }
  }
}

export class TableData {
  ColumnNames: string[];
  Data: string[][];
}

export class DBTable {
  name: string;
  column: DBColumn[];
  primaryKey: string[];
}

export class DBColumn {
  name: string;
}

export class DBSchema {
  name: string;
  table: DBTable[];
}

