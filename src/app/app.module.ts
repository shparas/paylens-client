import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormControlMessageComponent, AlertComponent } from './_minicomponents';
import { DashComponent } from './dash/dash.component';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { BanksComponent } from './banks/banks.component';
import { SettingsComponent } from './settings/settings.component';
import { PayComponent } from './pay/pay.component';
import { ReceiveComponent } from './receive/receive.component';
import { ReceivePortalComponent } from './receive/receive-portal/receive-portal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogBoxComponent } from './_minicomponents/confirmation-dialog-box/confirmation-dialog-box.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { PaidComponent } from './dash/paid/paid.component';
import { ReceivedComponent } from './dash/received/received.component';
import { BalanceComponent } from './dash/balance/balance.component';
import { PendingComponent } from './dash/pending/pending.component';
import { AlertDialogBoxComponent } from './_minicomponents/alert-dialog-box/alert-dialog-box.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AccountCardComponent } from './_minicomponents/account-card/account-card.component';
import { TransferredComponent } from './dash/transferred/transferred.component';

import { Platform, IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { RouteReuseStrategy } from '@angular/router';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FormControlMessageComponent,
    AlertComponent,
    DashComponent,
    BanksComponent,
    SettingsComponent,
    PayComponent,
    ReceiveComponent,
    ReceivePortalComponent,
    ConfirmationDialogBoxComponent,
    PaidComponent,
    ReceivedComponent,
    BalanceComponent,
    PendingComponent,
    AlertDialogBoxComponent,
    SidebarComponent,
    AccountCardComponent,
    TransferredComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    Platform,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    //, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
