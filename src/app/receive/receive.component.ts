import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { ValidationService, AuthenticationService, UserService, AlertService, PaymentService } from '../_services';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.less']
})
export class ReceiveComponent implements OnInit {
    receivePaymentForm: any;
    loading = false;
    submitted = false;

    constructor(
      private http: HttpClientModule,
      private route: ActivatedRoute,
      private router: Router,
      private alertService: AlertService,
      private authenticationService: AuthenticationService,
      private userService: UserService,
      private paymentService: PaymentService,
      private formBuilder: FormBuilder
    ) {}
  
    ngOnInit(): void {
      this.receivePaymentForm = this.formBuilder.group({
        amount: [0.0, [Validators.required]]
      });
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
  
      this.paymentService.receivePayment(this.pF.amount.value)
        .pipe(first())
        .subscribe(
          data => {
            console.log(data);
            this.router.navigate([data.id], { relativeTo: this.route });
          },
          error => {
            console.log(error);
            this.alertService.error(error);
            this.loading = false;
          });
    }
  
    
  }
