import { Component, Inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TicketListComponent } from '../ticket-list/ticket-list.component';
import { ModalContentComponentComponent } from '../modal-content-component/modal-content-component.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-action-cell-renderer',
  templateUrl: './action-cell-renderer.component.html',
  styleUrls: ['./action-cell-renderer.component.scss'],
})
export class ActionCellRenderer {
  params: any;

  constructor(public dialog: MatDialog,
    private route: Router
  ) { }

  singleData: any;
  agInit(params: any): void {
    this.params = params;
    console.log('ActionCellRenderer params:', this.params);
    console.log('Context:', this.params.context);
    debugger
    this.singleData = params.data;
  }

  openAction(): void {
    const dialogRef = this.dialog.open(ModalContentComponentComponent, {
      width: '40%',
      data: { value: this.singleData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Modal closed with result:', result);
    });
  }

  shareRowData(): void {
    if (this.params?.data) {
      console.log('Row data:', this.params.data);
    } else {
      console.error('Row data is not available.');
    }
  }

  viewTicketDetail() {
    this.route.navigate(['/master/ess/my-tickets/create-my-ticket'], { queryParams: { id: this.singleData.id, actionType: 'view' } });
  }

}
