import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../_models';
import { UserService, AuthenticationService, PaymentService } from '../../_services';

@Component({
  selector: 'app-paid',
  templateUrl: './paid.component.html',
  styleUrls: ['./paid.component.less']
})
export class PaidComponent implements OnInit {
  currentUser: User;
  componentData = [];

  itemPerPage = 20;
  _page: number = 1;
  set page(value: number) {
    if (value > this._page) {
      this._page = this.componentData.length == this.itemPerPage ? value : this._page;
    } else {
      this._page = value < 1 ? 1 : value;
    }
  }
  get page(): number {
    return this._page;
  }
  
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private paymentService: PaymentService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.getPaidPayments();
  }

  getPaidPayments() {
    this.paymentService.getPaidPayments(this.page)
    .subscribe(
      data => {
        if (data.length == 0){
          this.page--;
        }
        else {
          this.componentData = data;
        }
      }
    )
}

nextPage() {
  this.page++;
  this.getPaidPayments();
}

previousPage() {
  this.page--;
  this.getPaidPayments();
}
}