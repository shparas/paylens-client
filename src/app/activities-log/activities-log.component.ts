import { Component, OnInit } from '@angular/core';
import { first, filter } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, AuthenticationService, PaymentService } from '../_services';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-activities-log',
  templateUrl: './activities-log.component.html',
  styleUrls: ['./activities-log.component.scss']
})
export class ActivitiesLogComponent implements OnInit {
  public selectedIndex = -1;
  public path = "";
  public tabLinks = [
    {
      title: 'Paid',
      url: 'paid',
      icon: 'card'
    },
    // {
    //   title: 'Pending',
    //   url: 'pending',
    //   icon: 'cash',
    //   badge: {
    //     color: 'danger',
    //     text: '?' 
    //   }
    // },
    {
      title: 'Received',
      url: 'received',
      icon: 'cash',
      badge: {
        color: 'success',
        text: '✓' 
      }
    },
    {
      title: 'Transferred',
      url: 'transferred',
      icon: 'swap-vertical'
    }
  ];

  currentUser: User;
  users = [];

  paid = [];
  received = [];
  pending = [];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(val => {
        this.path = window.location.pathname.split('/')[2];
        if (this.path !== undefined) {
          this.selectedIndex = this.tabLinks.findIndex(page => page.title.toLowerCase() === this.path.toLowerCase());
        }
      });
  }

  ngOnInit() {
    this.getPendingPayments();
    this.getPaidPayments();
    this.getReceivedPayments();
  }

  getPendingPayments() {
    this.paymentService.getPendingPayments()
      .subscribe(
        data => {
          this.pending = data;
        }
      )
  }

  getPaidPayments() {
    this.paymentService.getPaidPayments()
      .subscribe(
        data => {
          this.paid = data;
        }
      )
  }

  getReceivedPayments() {
    this.paymentService.getReceivedPayments()
      .subscribe(
        data => {
          this.received = data;
        }
      )
  }
}