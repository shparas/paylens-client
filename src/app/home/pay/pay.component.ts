import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first, takeUntil } from 'rxjs/operators';

import { ValidationService, AuthenticationService, UserService, AlertService, PaymentService } from '../../_services';

import jsQR, { QRCode } from 'jsqr';
import { ConfirmationDialogBoxComponent, AlertDialogBoxComponent } from '../../_minicomponents';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Platform } from '@ionic/angular';

declare var $: any;

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
  @ViewChild('video', { static: true }) videoElm: ElementRef;
  @ViewChild('canvas', { static: true }) canvasElm: ElementRef;

  videoStart = false;
  medias: MediaStreamConstraints = {
    audio: false,
    video: false,
  };

  browserMode: boolean = undefined;

  makePaymentForm: any;
  loading = false;
  submitted = false;

  get uniqueId() {
    return Date.now();
  }

  constructor(
    public confirmationDialog: MatDialog,
    public alertDialog: MatDialog,
    private http: HttpClientModule,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private paymentService: PaymentService,
    private formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    public platform: Platform
  ) {
    this.router.events.subscribe(() => { });

    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        this.browserMode = false;
      } else {
        this.browserMode = true;
      }
    });
  }

  ngOnInit(): void {
    this.makePaymentForm = this.formBuilder.group({
      id: ['', [Validators.required]]
    });
  }

  get pF() { return this.makePaymentForm.controls; }
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.makePaymentForm.invalid) {
      return;
    }

    this.openDialog(this.pF.id.value);
  }

  toggleVideoMedia() {
    if (this.browserMode === true) {
      return this.videoStart ? this.stopVideo() : this.startVideo();
    } else if (this.browserMode === false) {
      const options: BarcodeScannerOptions = {
        showFlipCameraButton: true,
        showTorchButton: true,
        prompt: 'Place the code inside the scan region',
        resultDisplayDuration: 500,
        formats: 'QR_CODE,PDF_417',
        orientation: 'portrait',
      };

      this.barcodeScanner.scan(options).then(barcodeData => {
        console.log('Barcode data', barcodeData);
      }).catch(err => {
        console.log('Error', err);
      });
    }
  }

  startVideo() {
    this.medias.video = true;
    navigator.mediaDevices.getUserMedia(this.medias).then(
      (localStream: MediaStream) => {
        this.videoElm.nativeElement.srcObject = localStream;
        this.videoStart = true;
        this.checkImage();
      }
    ).catch(
      error => {
        console.error(error);
        this.videoStart = false;
      }
    );
  }

  stopVideo() {
    this.medias.video = false;
    this.videoElm.nativeElement.srcObject.getVideoTracks()[0].enabled = false;
    this.videoElm.nativeElement.srcObject.getVideoTracks()[0].stop();
    this.videoStart = false;
  }

  checkImage() {
    const WIDTH = this.videoElm.nativeElement.clientWidth;
    const HEIGHT = this.videoElm.nativeElement.clientHeight;
    this.canvasElm.nativeElement.width = WIDTH;
    this.canvasElm.nativeElement.height = HEIGHT;

    const ctx = this.canvasElm.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    ctx.drawImage(this.videoElm.nativeElement, 0, 0, WIDTH, HEIGHT)
    const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT)
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" })

    if (code) {
      this.openDialog(code.data);
    } else {
      setTimeout(() => { this.checkImage(); }, 100)
    }
  }

  openDialog(transactionId: string): void {
    var tempVideoStartValue = this.videoStart;
    this.loading = true;

    if (tempVideoStartValue) {
      this.stopVideo();
    }

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
                  this.loading = false;
                });
          } else {
            this.loading = false;
            if (tempVideoStartValue) {
              this.startVideo();
            }
          }
        });
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  };
}



