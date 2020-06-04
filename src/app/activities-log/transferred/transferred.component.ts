import { Component, OnInit, Input } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../_models';
import { UserService, AuthenticationService, PaymentService, AccountService } from '../../_services';
import { DateTime } from 'src/app/_helpers';


@Component({
  selector: 'app-transferred',
  templateUrl: './transferred.component.html',
  styleUrls: ['./transferred.component.scss']
})
export class TransferredComponent implements OnInit {
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
    private accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.accountService.getAllAccounts(true).subscribe(accounts => {
      this._accounts = accounts;
      this.getTransferred();
    });
  }

  getTransferred() {
    this.accountService.getTransfers(this.page).subscribe(data => {
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
      var day = DateTime.utcToLocalMmDdYyyy(element.date);
      element.accountName = element.accountId;
      element.fromOrTo = element.withdraw == true ? "to" : "from";

      this._accounts.forEach(account => {
        if (account.accountId == element.accountId) {
          element.accountName = `${account.institution.name} - ${account.subtype} (...${account.mask})`;
        }
      });

      if (!activeDay) {
        activeDay = day;
      }

      if (day != activeDay) {
        var dayItemCollection = { day: activeDay, data: dayTransactions };
        this.outputData.push(dayItemCollection);

        activeDay = day;
        dayTransactions = [];
      }

      var time = DateTime.utcToLocalHhMm(element.date);
      var dayItem = { time: time, data: element };
      dayTransactions.push(dayItem);
    });

    var dayItemCollection = { day: activeDay, data: dayTransactions };
    this.outputData.push(dayItemCollection);
  }


  nextPage() {
    if (this.componentData.to < this.componentData.totalAvailable && this.page < this.componentData.totalAvailable / this.itemPerPage) {
      this.page++;
      this.getTransferred();
    }
  }

  previousPage() {
    if (this.componentData.from > 1 && this.page > 1) {
      this.page--;
      this.getTransferred();
    }
  }
}
