import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, first, timeout } from 'rxjs/operators';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthenticationService, AlertService } from './_services';
import { User } from './_models';
import { UserService } from './_services';
import { NFC } from '@ionic-native/nfc/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'Paylens';
  public selectedIndex = -1;
  public path = "";
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Wallet',
      url: '/wallet',
      icon: 'wallet'
    },
    {
      title: 'Activities Log',
      url: '/activities-log',
      icon: 'receipt'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings'
    },
    {
      title: 'Log Out',
      url: '/log-out',
      icon: 'log-out'
    }
  ];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private userService: UserService,
    private nfc: NFC,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(val => {
        this.path = window.location.pathname.split('/')[1];
        if (this.path !== undefined) {
          this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === this.path.toLowerCase().replace('-', ' '));
        }
      });
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.enableNfcScan();
    });
  }

  private _currentUser: User;
  get currentUser(): User {
    if (Date.now() < parseInt(this._currentUser?.userInfo.expireTime)) {
      return this._currentUser;
    } else {
      this._currentUser = undefined;
      return undefined;
    }
  }
  set currentUser(user) {
    this._currentUser = user;
  }

  ngOnInit() {
    this.initializeApp();
  }

  getPageTitle() {
    if (this.selectedIndex < 0) {
      return "Welcome";
    } else {
      return this.appPages[this.selectedIndex].title;
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }


  getBalance() {
    this.userService.getBalance()
      .subscribe(
        data => {
          var balance = data.balance || 0.0;
        }
      );
  }


  enableNfcScan() {
    if (this.platform.is('android') && this.nfc.enabled) {
      this.enablePay();
      
      this.nfc.addNdefListener()
        .subscribe(
          data => {
            var paymentId = this.nfc.bytesToString(data?.tag?.ndefMessage[0]?.payload).trim();
            if (paymentId) {
              this.activePaymentId = paymentId;
            }
          },
          err => this.alertService.error("Error: " + err)
        );
    } else if (this.platform.is('ios')) {
      // this.nfc.scanNdef()
      //   .then(tag => {
      //       var id = this.nfc.bytesToString(tag?.ndefMessage[0]?.payload);
      //       if (id) {
      //         this.openDialog(id);
      //       }
      //     })
      //   .catch(err => this.alertService.error("Error: " + err));
    }
  }

  async pay(transactionId: string) {
    this.router.navigate(['home', 'pay', transactionId]).then(x => alert(transactionId + JSON.stringify(x))).catch(err => alert(err));
  }

  private activePaymentId: string | undefined;
  enablePay(){
    setTimeout(this.enablePay, 5000);
    
    alert("ACTIVE:  " + this.activePaymentId);
    if (this.activePaymentId) {
      this.pay(this.activePaymentId);
      this.activePaymentId = undefined;
    }
  }
}
