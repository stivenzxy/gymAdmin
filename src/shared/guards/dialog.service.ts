import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../app/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) {}

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent, {
      disableClose: true
    });

    return dialogRef.afterClosed();
  }
}
