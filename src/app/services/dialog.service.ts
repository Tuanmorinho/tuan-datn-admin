// import { WarningDialogComponent } from './../components/share/warning-dialog/warning-dialog.component';
// import { ConfirmDialogComponent } from './../components/share/confirm-dialog/confirm-dialog.component';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(public dialog: NgbModal) { }

  showDialog(component: any, options?: any) {
    return this.dialog.open(component, options);
  }

  confirm(message: string, options?: any) {
    // const data = { content: message };
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, options);
    // dialogRef.componentInstance.data = data;
    // return new Promise(resolve => {
    //   dialogRef.componentInstance.dismiss('close modal').subscribe(result => {
    //     resolve(result);
    //   });
    // });
  }

  warning(message: string, options?: any) {
    // const data = { content: message };
    // const dialogRef = this.dialog.open(WarningDialogComponent, options);
    // dialogRef.componentInstance.messsage = message;
  }
}
