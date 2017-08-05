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
var SystemStateComponent = (function () {
    function SystemStateComponent(backendService) {
        this.backendService = backendService;
        this.name = 'System State';
    }
    SystemStateComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.backendService.loadState().then(function (state) {
            return _this.appState = state;
        });
    };
    return SystemStateComponent;
}());
SystemStateComponent = __decorate([
    core_1.Component({
        selector: 'sys-state',
        templateUrl: 'templates/sys-state.html',
    }),
    __metadata("design:paramtypes", [BackendService_1.BackendService])
], SystemStateComponent);
exports.SystemStateComponent = SystemStateComponent;
//# sourceMappingURL=SystemState.component.js.map