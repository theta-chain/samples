import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {IRSDemoComponent} from './IRSDemo.component';
import {SystemStateComponent} from './SystemState.component';
import {DBStateComponent} from './DBState.component';
import {OpenOffersComponent} from './OpenOffersComponent';
import {ContractListComponent} from './ContractListComponent';
import {InterestRatesComponent} from './InterestRatesComponent';
import {BackendService} from './BackendService';
import {RouterModule} from '@angular/router';
import {ContractDetailComponent} from './ContractDetailComponent';
import {MdDatepickerModule, MdNativeDateModule, MdDialogModule, MdInputModule, MdButtonModule, MdSelectModule} from '@angular/material';
import {MdProgressBarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InterestRateDlgComponent} from './InterestRateDlgComponent';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OfferDlgComponent} from './OfferDlgComponent';


@NgModule({
  imports: [BrowserModule, HttpModule, MdDatepickerModule, MdNativeDateModule, MdDialogModule,
    BrowserAnimationsModule, FormsModule, ReactiveFormsModule, MdInputModule, MdButtonModule,
    MdSelectModule, MdProgressBarModule,
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
      },
      {
        path: 'rates',
        component: InterestRatesComponent
      },
      {
        path: 'contract/:id',
        component: ContractDetailComponent
      }
    ], {useHash: true}),
    FormsModule],
  declarations: [AppComponent, OpenOffersComponent, ContractListComponent, InterestRateDlgComponent,
    IRSDemoComponent, SystemStateComponent, DBStateComponent, InterestRatesComponent,
    OfferDlgComponent, ContractDetailComponent],
  entryComponents: [InterestRateDlgComponent, OfferDlgComponent],
  providers: [BackendService],
  bootstrap: [AppComponent]
})
export class AppModule {}
