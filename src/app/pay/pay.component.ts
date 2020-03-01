import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { ValidationService, AuthenticationService, UserService, AlertService, PaymentService } from '../_services';

import jsQR, { QRCode } from 'jsqr';
import { DialogComponent } from '../_minicomponents/dialog/dialog.component';


declare var $: any;

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.less']
})
export class PayComponent implements OnInit {
  @ViewChild('video', {static: true}) videoElm: ElementRef;
  @ViewChild('canvas', {static: true}) canvasElm: ElementRef;
  
  videoStart = false;
  medias: MediaStreamConstraints = {
    audio: false,
    video: false,
  };

  makePaymentForm: any;
  loading = false;
  submitted = false;

  get uniqueId() {
    return Date.now();
  }

  constructor(
    public dialog: MatDialog,
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

    this.loading = true;

    this.paymentService.makePayment(this.pF.id.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }


  toggleVideoMedia() {
    if (this.videoStart) {
      this.stopVideo();
    } else {
      this.startVideo()
    }
    // this.videoStart ? this.stopVideo() : this.startVideo()
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
    this.canvasElm.nativeElement.width  = WIDTH;
    this.canvasElm.nativeElement.height = HEIGHT;

    const ctx = this.canvasElm.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    ctx.drawImage(this.videoElm.nativeElement, 0, 0, WIDTH, HEIGHT)
    const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT)
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" })

    if (code) {
        this.openDialog(code);
    } else {
        setTimeout(() => { this.checkImage(); }, 100)
    }
  }

  openDialog(code: QRCode): void {
    this.stopVideo();
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '360px',
      data: {data: code.data}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.checkImage();
    });
  }

}



