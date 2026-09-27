import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SignatureApprovalDialogComponent } from '../signature-approval-dialog/signature-approval-dialog.component';

@Component({
  selector: 'app-digital-signature-approval-action',
  templateUrl: './digital-signature-approval-action.component.html',
  styleUrls: ['./digital-signature-approval-action.component.scss']
})
export class DigitalSignatureApprovalActionComponent {
  public cellValue: any;

  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {

  }


  public rowData: any;

  agInit(params: ICellRendererParams): void {
    this.rowData = params.data;
    this.cellValue = params.data?.digital_signature_id;
    console.log("Signature ID in agInit:", this.cellValue);
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }


  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }


  edit(event: any) {
    console.log("Edit Clicked:", this.cellValue);
    const dialogRef = this.dialog.open(SignatureApprovalDialogComponent, {
      data: { id: this.cellValue },
      width: '25%',
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

}
