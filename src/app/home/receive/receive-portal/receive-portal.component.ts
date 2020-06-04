import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';


import { ValidationService, AuthenticationService, UserService, AlertService, PaymentService } from '../../../_services';

declare var $: any;



@Component({
  selector: 'app-receive-portal',
  templateUrl: './receive-portal.component.html',
  styleUrls: ['./receive-portal.component.scss']
})
export class ReceivePortalComponent implements OnInit {
  id: string;
  paidBy: string;
  paidOn: string;
  amount: number;

  stopPolling: boolean = false;

  constructor(
    private http: HttpClientModule,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private paymentService: PaymentService,
    private formBuilder: FormBuilder
  ) {
    this.router.events.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get("id")
      this.amount = 0;
      $("#qr-show").empty();
      $("#qr-show").qrcode(this.id);
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    $("#qr-show").qrcode(this.id);
    this.checkForPaymentUpdate();
    this.stopPolling = false;
  }
 
  ngOnDestroy() {
    this.stopPolling = true;
  }

  
  sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds*1000))
  }

  checkForPaymentUpdate() {
    this.paymentService.getPaymentStatus(this.id)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.amount= parseFloat(data.amount);
          if (data.paidBy && data.paidBy != '') {
            $("#qr-show").text(`${data.paidBy} paid you!`);
          } else {
            if (!this.stopPolling){
              this.sleep(5).then(() => {
                this.checkForPaymentUpdate();
              });
            }
          }
        },
        error => {
          console.log(error);
          this.alertService.error(error);
        });
  }
}
