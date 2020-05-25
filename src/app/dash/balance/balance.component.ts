import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../_models';
import { UserService, AuthenticationService, PaymentService } from '../../_services';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.less']
})
export class BalanceComponent implements OnInit {
  currentUser: User;
  balance: number = 0;

  constructor(
    private authenticationService: AuthenticationService,
    private paymentService: PaymentService,
    private userService: UserService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.getBalance();
  }


  getBalance() {
    this.userService.getBalance()
      .subscribe(
        data => {
          this.balance = data.balance || 0.0;
        }
      )
  }


}
