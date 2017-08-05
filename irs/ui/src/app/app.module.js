"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var IRSDemo_component_1 = require("./IRSDemo.component");
var SystemState_component_1 = require("./SystemState.component");
var DBState_component_1 = require("./DBState.component");
var OpenOffersComponent_1 = require("./OpenOffersComponent");
var ContractsComponent_1 = require("./ContractsComponent");
var BackendService_1 = require("./BackendService");
var router_1 = require("@angular/router");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, http_1.HttpModule,
            router_1.RouterModule.forRoot([
                {
                    path: '',
                    redirectTo: '/irs',
                    pathMatch: 'full'
                },
                {
                    path: 'irs',
                    component: IRSDemo_component_1.IRSDemoComponent
                },
                {
                    path: 'sysstate',
                    component: SystemState_component_1.SystemStateComponent
                },
                {
                    path: 'dbstate',
                    component: DBState_component_1.DBStateComponent
                }
            ], { useHash: true }),
            forms_1.FormsModule],
        declarations: [app_component_1.AppComponent, OpenOffersComponent_1.OpenOffersComponent, ContractsComponent_1.ContractsComponent, IRSDemo_component_1.IRSDemoComponent, SystemState_component_1.SystemStateComponent, DBState_component_1.DBStateComponent],
        providers: [BackendService_1.BackendService],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map