import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { IRSDemoComponent } from './IRSDemo.component';
import { SystemStateComponent } from './SystemState.component';
import { DBStateComponent } from './DBState.component';
import { OpenOffersComponent } from './OpenOffersComponent';
import { ContractsComponent } from './ContractsComponent';
import { BackendService } from './BackendService';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [BrowserModule, HttpModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/irs',
        pathMatch: 'full'
      },
      {
        path: 'irs',
        component: IRSDemoComponent
      },
      {
        path: 'sysstate',
        component: SystemStateComponent
      },
      {
        path: 'dbstate',
        component: DBStateComponent
      }
    ],{useHash: true }),
    FormsModule],
  declarations: [AppComponent, OpenOffersComponent, ContractsComponent, IRSDemoComponent, SystemStateComponent, DBStateComponent],
  providers: [BackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
