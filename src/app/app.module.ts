import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginRegisterComponent } from './login-register/login-register.component';
import { FormControlMessageComponent, AlertComponent } from './_minicomponents';
import { ActivitiesLogComponent } from './activities-log/activities-log.component';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { BanksComponent } from './banks/banks.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { PayComponent } from './home/pay/pay.component';
import { ReceiveComponent } from './home/receive/receive.component';
import { ReceivePortalComponent } from './home/receive/receive-portal/receive-portal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogBoxComponent } from './_minicomponents/confirmation-dialog-box/confirmation-dialog-box.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { PaidComponent } from './activities-log/paid/paid.component';
import { ReceivedComponent } from './activities-log/received/received.component';
import { PendingComponent } from './activities-log/pending/pending.component';
import { AlertDialogBoxComponent } from './_minicomponents/alert-dialog-box/alert-dialog-box.component';
import { AccountCardComponent } from './_minicomponents/account-card/account-card.component';
import { TransferredComponent } from './activities-log/transferred/transferred.component';

import { Platform, IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PayPortalComponent } from './home/pay/pay-portal/pay-portal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    FormControlMessageComponent,
    AlertComponent,
    ActivitiesLogComponent,
    BanksComponent,
    SettingsComponent,
    HomeComponent,
    PayComponent,
    PayPortalComponent,
    ReceiveComponent,
    ReceivePortalComponent,
    ConfirmationDialogBoxComponent,
    PaidComponent,
    ReceivedComponent,
    PendingComponent,
    AlertDialogBoxComponent,
    AccountCardComponent,
    TransferredComponent
  ],
  entryComponents: [],
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
    NFC,
    Ndef,
    Platform,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
