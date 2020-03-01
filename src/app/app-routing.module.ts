import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DashComponent } from './dash/dash.component';
import { SettingsComponent } from './settings/settings.component';
import { ReceiveComponent } from './receive/receive.component';
import { PayComponent } from './pay/pay.component';
import { BanksComponent } from './banks/banks.component';
import { AuthGuard } from './_helpers';
import { ReceivePortalComponent } from './receive/receive-portal/receive-portal.component';
import { PaidComponent } from './dash/paid/paid.component';
import { BalanceComponent } from './dash/balance/balance.component';
import { PendingComponent } from './dash/pending/pending.component';
import { ReceivedComponent } from './dash/received/received.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'banks', component: BanksComponent, canActivate: [AuthGuard] },
  {
    path: 'dash', component: DashComponent, canActivate: [AuthGuard], children:
      [
        { path: '',  redirectTo: 'balance', pathMatch: 'full'  },
        { path: 'balance', component: BalanceComponent },
        { path: 'paid', component: PaidComponent },
        { path: 'pending', component: PendingComponent },
        { path: 'received', component: ReceivedComponent }
      ]
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'pay', component: PayComponent, canActivate: [AuthGuard] },
  { path: 'receive', component: ReceiveComponent, canActivate: [AuthGuard], children: [{ path: ':id', component: ReceivePortalComponent }] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }