import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoginRegisterComponent } from './login-register/login-register.component';
import { ActivitiesLogComponent } from './activities-log/activities-log.component';
import { SettingsComponent } from './settings/settings.component';
import { ReceiveComponent } from './home/receive/receive.component';
import { HomeComponent } from './home/home.component';

import { BanksComponent } from './banks/banks.component';
import { AuthGuard } from './_helpers';
import { ReceivePortalComponent } from './home/receive/receive-portal/receive-portal.component';
import { PaidComponent } from './activities-log/paid/paid.component';
import { PendingComponent } from './activities-log/pending/pending.component';
import { ReceivedComponent } from './activities-log/received/received.component';
import { TransferredComponent } from './activities-log/transferred/transferred.component';
import { PayComponent } from './home/pay/pay.component';
import { PayPortalComponent } from './home/pay/pay-portal/pay-portal.component';

const routes: Routes = [
  { path: '', component: LoginRegisterComponent },
  { path: 'wallet', component: BanksComponent, canActivate: [AuthGuard] },
  {
    path: 'activities-log', component: ActivitiesLogComponent, canActivate: [AuthGuard], children:
      [
        { path: '', redirectTo: 'paid', pathMatch: 'full' },
        { path: 'paid', component: PaidComponent },
        { path: 'pending', component: PendingComponent },
        { path: 'received', component: ReceivedComponent },
        { path: 'transferred', component: TransferredComponent }
      ]
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard], children:
      [
        { path: '', redirectTo: 'pay', pathMatch: 'full' },
        {
          path: 'pay', component: PayComponent, children:
            [
              { path: ':id', component: PayPortalComponent }
            ]
        },
        {
          path: 'receive', component: ReceiveComponent, children:
            [
              { path: ':id', component: ReceivePortalComponent }
            ]
        }]
  },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'log-out', component: LoginRegisterComponent, canActivate: [AuthGuard] }

  // loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
