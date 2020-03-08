import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'confirmation-dialog-box-dialog',
  templateUrl: './confirmation-dialog-box.component.html',
  styleUrls: ['./confirmation-dialog-box.component.less']
})
export class ConfirmationDialogBoxComponent {
  displayPrompt: string;
  confirmStatus: boolean;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.displayPrompt = data.displayPrompt;
  }

  close(): void {
    this.dialogRef.close({confirm: this.confirmStatus});
  }

  confirm(): void{
    this.confirmStatus = true;
    this.close();
  }

  cancel(): void{
    this.confirmStatus = false;
    this.close();
  }
}
