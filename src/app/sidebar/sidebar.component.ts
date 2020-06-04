import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';
import { User } from '../_models';

import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
  @Input() currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private menu: MenuController
  ) {
  }
  

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }







  ngOnInit(): void {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }

}
