import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthenticationService } from './_services';
import { User } from './_models';
import { UserService } from './_services';

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
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private userService: UserService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(val => {
        this.path = window.location.pathname.split('/')[1];
        if (this.path !== undefined) {
          this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === this.path.toLowerCase().replace('-',' '));
        }
      });
    this.initializeApp();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private _currentUser: User;
  get currentUser(): User{
    if (parseInt(this._currentUser?.userInfo.expireTime) >= Date.now()){
      return this._currentUser;
    } else {
      this._currentUser = undefined;
      return undefined;
    }
  }
  set currentUser(user){
    this._currentUser = user;
  }

  ngOnInit() {
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
}
