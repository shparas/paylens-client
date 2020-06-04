import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogBoxComponent, AlertDialogBoxComponent } from '../';
import { AccountService, AlertService } from 'src/app/_services';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.scss']
})
export class AccountCardComponent implements OnInit {
  @Input() account: any;
  public deleted = false;
  public loading = false;

  getBackground() {
    return {
      backgroundColor: this.account.institution.color,
      backgroundImage: `url(data:image/png;base64,${this.account.institution.logo})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center'
    }
  }
  constructor(
    private _sanitizer: DomSanitizer,
    private confirmationDialog: MatDialog,
    private accountService: AccountService,
    private alertDialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
  }


  removeAccount(): void {
    alert(this.account._id);
    const confirmationDialogRef = this.confirmationDialog.open(ConfirmationDialogBoxComponent, {
      width: '360px',
      data: {
        displayPrompt: `You're about to delete the account ${this.account.subtype} ...${this.account.mask}. Confirm?`
      }
    });

    confirmationDialogRef.afterClosed().subscribe(result => {
      if (result.confirm == true) {
        this.accountService.removeAccount(this.account._id)
          .subscribe(
            data => {
              const alertDialogRef = this.alertDialog.open(AlertDialogBoxComponent, {
                width: '360px',
                data: {
                  displayPrompt: "Success!"
                }
              });
              alertDialogRef.afterClosed().subscribe(result => {
                this.deleted = true;
              });
            },
            error => {
              this.alertService.error(error);
            });
      }
    });
  }
}
