import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { ValidationService, AuthenticationService, UserService, AlertService, PaymentService } from '../_services';
import { DateTime } from '../_helpers';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.less']
})
export class ReceiveComponent implements OnInit {
  receivePaymentForm: any;
  loading = false;
  submitted = false;
  componentData = [];
  outputData = [];

  get uniqueId() {
    return Date.now();
  }

  constructor(
    private http: HttpClientModule,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private paymentService: PaymentService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.receivePaymentForm = this.formBuilder.group({
      amount: [0.0, [Validators.required]],
      rawId: [Date.now(), [Validators.required]]
    });

    this.getPendingPayments();
  }

  get pF() { return this.receivePaymentForm.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.receivePaymentForm.invalid) {
      return;
    }

    this.loading = true;

    this.paymentService.receivePayment(this.pF.amount.value, this.pF.rawId.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([data.id], { relativeTo: this.route });
          this.pF.rawId.setValue(Date.now());
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  getPendingPayments() {
    this.paymentService.getPendingPayments()
      .subscribe(
        data => {
          this.formatData(data);
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

}
