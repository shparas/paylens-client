import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '../_services';
import { FormBuilder, Validators } from '@angular/forms';

declare var $: any;
declare var Plaid: any;

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.less']
})
export class BanksComponent implements OnInit {
  _handler: any;
  _accounts: [any];
  withdraw: boolean = false;
  transfer: boolean = true;


  transferFundForm: any;
  constructor(
    private accountService: AccountService,
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
    this.getTransfers();

  }

  plaidHanderCreator(): any {
    return Plaid.create({
      clientName: 'Sigmoid Pay',
      // Optional, specify an array of ISO-3166-1 alpha-2 country
      // codes to initialize Link; European countries will have GDPR
      // consent panel
      countryCodes: ['US'],
      env: 'sandbox',
      // Replace with your public_key from the Dashboard
      key: '066eab548902d1532836b65fa0c7be',
      product: ['transactions'],
      // Optional, use webhooks to get transaction and error updates
      // webhook: 'https://requestb.in',
      // Optional, specify a language to localize Link
      language: 'en',
      // Optional, specify userLegalName and userEmailAddress to
      // enable all Auth features
      userLegalName: 'Paras Sharma',
      userEmailAddress: 'shparas97@gmail.com',
      onLoad: function () {
        // Optional, called when Link loads
      },
      onSuccess: (public_token, metadata) => {
        this.accountService
          .addAccount(public_token, metadata.account, metadata.institution)
          .subscribe(
            data => {
              this.alertService.success('Account added successfully!', true);
              console.log(data);
            },
            error => {

            });;

        console.log("OnSuccess", public_token, metadata);

        // Send the public_token to your app server.
        // The metadata object contains info about the institution the
        // user selected and the account ID or IDs, if the
        // Select Account view is enabled.
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
    /*
    var testApi = {
      institution: { name: "Chase", institution_id: "ins_3" },
      account: { id: "MxDqnPgo1rfrVMjNd5NAfjnA5ymWlBi9oPLZl", name: "Plaid Checking", type: "depository", subtype: "checking", mask: "0000" },
      account_id: "MxDqnPgo1rfrVMjNd5NAfjnA5ymWlBi9oPLZl",
      public_token: "public-sandbox-526a9a37-f65e-4051-aef0-8077cace7a5a"
    }
    this.accountService.addAccount(testApi.public_token, testApi.account, testApi.institution).subscribe(
      data => {
        this.alertService.success('Account added successfully!', true);
      },
      error => {

      });
    */
    this._handler.open();
    this.getAllAccounts();
  }

  getAllAccounts(): void {
    this.accountService.getAllAccounts().subscribe(
      data => {
        console.log(data);
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
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }
  getTransfers() {
    this.accountService.getTransfers(10).subscribe(
      data => {
        console.log(data);
      },
      error => {

      }
    )
  }
}
