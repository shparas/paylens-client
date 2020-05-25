import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, AuthenticationService, PaymentService } from '../_services';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.less']
})
export class DashComponent implements OnInit {
  currentUser: User;
  users = [];

  paid = [];
  received = [];
  pending = [];

  constructor(
      private authenticationService: AuthenticationService,
      private userService: UserService,
      private paymentService: PaymentService
  ) {
      this.currentUser = this.authenticationService.currentUserValue;
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