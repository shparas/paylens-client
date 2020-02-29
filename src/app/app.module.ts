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
    ReceivePortalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
