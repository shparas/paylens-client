import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { DateTime } from '../../_helpers';
import { User } from '../../_models';
import { UserService, AuthenticationService, PaymentService } from '../../_services';

@Component({
  selector: 'app-paid',
  templateUrl: './paid.component.html',
  styleUrls: ['./paid.component.scss']
})
export class PaidComponent implements OnInit {
  itemPerPage = 20;
  currentUser: User;
  componentData: any;
  outputData = [];
  _accounts: any;
  page = 1;
  previousAvailable: boolean;
  nextAvailable: boolean;

  get previousAvailableCheck() {
    return this.componentData.from !== 1 ? true : false;
  }

  get nextAvailableCheck() {
    return this.componentData.to < this.componentData.total ? true : false;
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
    this.paymentService.getPaidPayments(this.page).subscribe(data => {
      this.formatData(data);
      this.previousAvailable = data.from > 1 ? true : false;
      this.nextAvailable = data.to < data.totalAvailable ? true : false;
    });
  }

  formatData(data: any) {
    // store original data
    this.componentData = data;

    // modify to display output
    this.outputData = [];
    var dayTransactions = [];
    var activeDay = undefined;
    data.items.forEach(element => {
      var day = DateTime.utcToLocalMmDdYyyy(element.paidOn);

      if (!activeDay) {
        activeDay = day;
      }

      if (day != activeDay) {
        var dayItemCollection = { day: activeDay, data: dayTransactions };
        this.outputData.push(dayItemCollection);

        activeDay = day;
        dayTransactions = [];
      }

      var time = DateTime.utcToLocalHhMm(element.paidOn);
      var dayItem = { time: time, data: element };
      dayTransactions.push(dayItem);
    });

    var dayItemCollection = { day: activeDay, data: dayTransactions };
    this.outputData.push(dayItemCollection);
  }

  nextPage() {
    if (this.componentData.to < this.componentData.totalAvailable && this.page < this.componentData.totalAvailable / this.itemPerPage) {
      this.page++;
      this.getPaidPayments();
    }
  }

  previousPage() {
    if (this.componentData.from > 1 && this.page > 1) {
      this.page--;
      this.getPaidPayments();
    }
  }
}
