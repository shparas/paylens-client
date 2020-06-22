import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AlertService, PaymentService } from '../../../_services';

import { ConfirmationDialogBoxComponent, AlertDialogBoxComponent } from '../../../_minicomponents';

@Component({
  selector: 'app-pay-portal',
  templateUrl: './pay-portal.component.html',
  styleUrls: ['./pay-portal.component.scss'],
})
export class PayPortalComponent implements OnInit {

  constructor(    public confirmationDialog: MatDialog,
    public alertDialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private paymentService: PaymentService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id){
        this.openDialog(params.id);
      }
    })
  }

  openDialog(transactionId: string): void {
    this.paymentService.getPaymentDetail(transactionId).subscribe(
      data => {
        const confirmationDialogRef = this.confirmationDialog.open(ConfirmationDialogBoxComponent, {
          width: '360px',
          data: {
            displayPrompt: `You're about to pay $${data.amount} to ${data.createdBy}. Confirm payment?`
          }
        });

        confirmationDialogRef.afterClosed().subscribe(result => {
          if (result.confirm == true) {
            this.paymentService.makePayment(transactionId)
              .pipe(first())
              .subscribe(
                data => {
                  const alertDialogRef = this.alertDialog.open(AlertDialogBoxComponent, {
                    width: '360px',
                    data: {
                      displayPrompt: "Success!"
                    }
                  });
                  alertDialogRef.afterClosed().subscribe(result => {
                    this.router.navigate(['..'], { relativeTo: this.route });
                  });
                },
                error => {
                  this.alertService.error(error);
                });
          } else {
            this.router.navigate(['..'], {relativeTo: this.route})
          }
        });
      },
      error => {
        this.alertService.error(error);
      });
  };
}
