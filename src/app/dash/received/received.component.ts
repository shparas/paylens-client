import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../_models';
import { UserService, AuthenticationService, PaymentService } from '../../_services';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.less']
})
export class ReceivedComponent implements OnInit {
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
    private paymentService: PaymentService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.getReceivedPayments();
  }

  getReceivedPayments() {
    this.paymentService.getReceivedPayments(this.page)
      .subscribe(
        data => {
          if (data.length == 0) {
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
    this.getReceivedPayments();
  }

  previousPage() {
    this.page--;
    this.getReceivedPayments();
  }
}
