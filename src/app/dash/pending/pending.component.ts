import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../_models';
import { UserService, AuthenticationService, PaymentService } from '../../_services';
import { DateTime } from 'src/app/_helpers';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.less']
})
export class PendingComponent implements OnInit {
  currentUser: User;
  componentData = [];
  outputData = [];

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
    this.getPendingPayments();
  }

  getPendingPayments() {
    this.paymentService.getPendingPayments(this.page)
      .subscribe(
        data => {
          if (data.length == 0){
            this.page--;
          }
          else {
            this.formatData(data);
          }
        }
      )
  }

  formatData(data: any) {
    // store original data
    this.componentData = data;

    // modify to display output
    this.outputData = [];
    var dayTransactions = [];
    var activeDay = undefined;
    data.forEach(element => {
      var day = DateTime.utcToLocalMmDdYyyy(element.createdOn);

      if (!activeDay) {
        activeDay = day;
      }

      if (day != activeDay) {
        var dayItemCollection = { day: activeDay, data: dayTransactions };
        this.outputData.push(dayItemCollection);

        activeDay = day;
        dayTransactions = [];
      }

      var time = DateTime.utcToLocalHhMm(element.createdOn);
      var dayItem = { time: time, data: element };
      dayTransactions.push(dayItem);
    });

    var dayItemCollection = { day: activeDay, data: dayTransactions };
    this.outputData.push(dayItemCollection);

    console.log(this.outputData);
  }

  nextPage() {
    this.page++;
    this.getPendingPayments();
  }

  previousPage() {
    this.page--;
    this.getPendingPayments();
  }
}