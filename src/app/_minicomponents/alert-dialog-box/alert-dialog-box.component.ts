import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog-box',
  templateUrl: './alert-dialog-box.component.html',
  styleUrls: ['./alert-dialog-box.component.less']
})
export class AlertDialogBoxComponent {
  displayPrompt: string;

  constructor(
    public dialogRef: MatDialogRef<AlertDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.displayPrompt = data.displayPrompt;
  }
}
