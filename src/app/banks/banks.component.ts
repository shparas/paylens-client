import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService, AuthenticationService } from '../_services';
import { FormBuilder, Validators } from '@angular/forms';

declare var $: any;
declare var Plaid: any;

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {
  _handler: any;
  _accounts: any[];
  withdraw: boolean = false;
  transfer: boolean = true;
  transferFundForm: any;

  constructor(
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this._handler = this.plaidHanderCreator();

    this.transferFundForm = this.formBuilder.group({
      amount: [0.0, [Validators.required]],
      withdraw: [false, [Validators.required]],
      accountId: ["", [Validators.required]],
      rawId: [Date.now(), [Validators.required]]
    });

    this.getAllAccounts();
  }

  plaidHanderCreator(): any {
    return Plaid.create({
      clientName: 'Sigmoid Pay',
      countryCodes: ['US'],
      env: 'sandbox',
      key: '066eab548902d1532836b65fa0c7be',
      product: ['transactions'],
      language: 'en',
      // Optional, specify userLegalName and userEmailAddress to
      // enable all Auth features
      userLegalName: this.authenticationService.currentUserValue?.userInfo.firstname + " " + this.authenticationService.currentUserValue?.userInfo.lastname,
      userEmailAddress: this.authenticationService.currentUserValue?.userInfo.email,
      onLoad: function () {
        // Optional, called when Link loads
      },
      onSuccess: (public_token, metadata) => {
        // Send the public_token to your app server.
        // The metadata object contains info about the institution the
        // user selected and the account ID or IDs, if the
        // Select Account view is enabled.
        this.accountService
          .addAccount(public_token, metadata.account, metadata.institution)
          .subscribe(
            data => {
              this.alertService.success('Account added successfully!');
              this.getAllAccounts();
            },
            error => {
              this.alertService.error('Failed to add account: ' + error);
            });;
      },
      onExit: function (err, metadata) {
        // The user exited the Link flow.
        if (err != null) {
          // The user encountered a Plaid API error prior to exiting.
        }
        // metadata contains information about the institution
        // that the user selected and the most recent API request IDs.
        // Storing this information can be helpful for support.
      },
      onEvent: function (eventName, metadata) {
        // Optionally capture Link flow events, streamed through
        // this callback as your users connect an Item to Plaid.
        // For example:
        // eventName = "TRANSITION_VIEW"
        // metadata  = {
        //   link_session_id: "123-abc",
        //   mfa_type:        "questions",
        //   timestamp:       "2017-09-14T14:42:19.350Z",
        //   view_name:       "MFA",
        // }
      }
    });
  }

  addAccount(): void {
    this._handler.open();
  }

  getAllAccounts(): void {
    this.accountService.getAllAccounts().subscribe(
      data => {
        this._accounts = data;
      },
      error => {

      });
  }

  processPayment(): void {
    var tf = this.transferFundForm.controls;

    var accountId = tf.accountId.value;
    var amount = tf.amount.value;
    var withdraw = tf.withdraw.value;

    this.accountService.processPayment(accountId, withdraw, amount).subscribe(
      data => {
        this.alertService.success("Successfully initiated the transfer!");
      },
      error => {
        this.alertService.error("Couldn't initiate the transfer. " + error);
      }
    )
  }
}
