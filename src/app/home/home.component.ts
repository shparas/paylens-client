import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { first, takeUntil, filter } from 'rxjs/operators';

import { ValidationService, AuthenticationService, UserService, AlertService, PaymentService } from '../_services';

import jsQR, { QRCode } from 'jsqr';
import { ConfirmationDialogBoxComponent, AlertDialogBoxComponent } from '../_minicomponents';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Platform } from '@ionic/angular';

declare var $: any;

@Component({
  selector: 'app-pay',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public selectedIndex = -1;
  public path = "";
  public tabLinks = [
    {
      title: 'Pay',
      url: 'pay',
      icon: 'card'
    },
    {
      title: 'Receive',
      url: 'receive',
      icon: 'cash'
    }
  ];

  constructor(
    public confirmationDialog: MatDialog,
    public alertDialog: MatDialog,
    private http: HttpClientModule,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private paymentService: PaymentService,
    private formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    public platform: Platform
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(val => {
        this.path = window.location.pathname.split('/')[2];
        if (this.path !== undefined) {
          this.selectedIndex = this.tabLinks.findIndex(page => page.title.toLowerCase() === this.path.toLowerCase());
        }
      });
  }

  ngOnInit(){
  }
}



