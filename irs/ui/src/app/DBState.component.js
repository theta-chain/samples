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
var BackendService_1 = require("./BackendService");
var DBStateComponent = (function () {
    function DBStateComponent(backendService) {
        this.backendService = backendService;
        this.name = 'DB State';
        this.selectedTableName = null;
        this.tableData = null;
    }
    DBStateComponent.prototype.refreshSchema = function () {
        var _this = this;
        this.backendService.loadState().then(function (state) {
            return _this.appState = state;
        });
        this.backendService.getSchema().then(function (schema) {
            return _this.schema = schema;
        });
    };
    DBStateComponent.prototype.ngOnInit = function () {
        this.refreshSchema();
    };
    DBStateComponent.prototype.loadData = function () {
        var _this = this;
        this.backendService.getTableData(this.selectedTableName).then(function (data) { return _this.tableData = data; });
    };
    DBStateComponent.prototype.reloadHashes = function () {
        var _this = this;
        this.backendService.loadHashData().then(function (data) {
            return _this.transactionHashData = data;
        });
    };
    DBStateComponent.prototype.jstring = function (obj) {
        if (obj == null) {
            return '';
        }
        else {
            return JSON.stringify(obj);
        }
    };
    return DBStateComponent;
}());
DBStateComponent = __decorate([
    core_1.Component({
        selector: 'db-state',
        templateUrl: 'templates/db-state.html',
    }),
    __metadata("design:paramtypes", [BackendService_1.BackendService])
], DBStateComponent);
exports.DBStateComponent = DBStateComponent;
var TableData = (function () {
    function TableData() {
    }
    return TableData;
}());
exports.TableData = TableData;
var DBTable = (function () {
    function DBTable() {
    }
    return DBTable;
}());
exports.DBTable = DBTable;
var DBColumn = (function () {
    function DBColumn() {
    }
    return DBColumn;
}());
exports.DBColumn = DBColumn;
var DBSchema = (function () {
    function DBSchema() {
    }
    return DBSchema;
}());
exports.DBSchema = DBSchema;
//# sourceMappingURL=DBState.component.js.map