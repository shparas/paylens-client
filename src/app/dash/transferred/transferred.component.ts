import { Component, OnInit, Input } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../_models';
import { UserService, AuthenticationService, PaymentService, AccountService } from '../../_services';
import { DateTime } from 'src/app/_helpers';


@Component({
  selector: 'app-transferred',
  templateUrl: './transferred.component.html',
  styleUrls: ['./transferred.component.less']
})
export class TransferredComponent implements OnInit {
  currentUser: User;
  componentData = [];
  outputData = [];
  itemPerPage = 20;
  _page: number = 1;

  @Input() _accounts:any;

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
    private accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.getReceivedPayments();
  }

  getReceivedPayments() {
    this.accountService.getTransfers(this.page)
      .subscribe(
        data => {
          if (data.length == 0) {
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
      
      console.log("ACC:", this._accounts);
      element.accountName = element.accountId;

      this._accounts.forEach(account => {
        if (account.id == element.accountId){
          element.accountName = `${account.institution.name} - ${account.subtype} (...${account.mask})`;
        }
      })
      element.fromOrTo = element.withdraw == true? "to": "from";
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
