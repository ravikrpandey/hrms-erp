import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SalesService } from '../../service/sales.service';

@Component({
  selector: 'app-view-invoice-irn.component',
  templateUrl: './view-invoice-irn.component.html',
  styleUrls: ['./view-invoice-irn.component.scss'],
})
export class viewInvoiceIrn {
  cellData: any;
  getData: any = [];
  viewIrnData: any;
  remarkshow: any;
  constructor(
    public dialog: MatDialogRef<viewInvoiceIrn>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sales: SalesService,
    private toast: ToastrService,
    private route: Router
  ) {
    this.cellData = this.data.cellData;
  }

  ngOnInit(): void {
    this.getInvoiceIrnDataByDoId();
  }

  getInvoiceIrnDataByDoId() {
    
    this._sales.getInvoiceIrnDataByDoId(this.cellData).subscribe(
      (res: any) => {
        this.viewIrnData = res.data;
      },
      (err: any) => {
        if (err.status == 400) {
        }
      }
    );
  }
  view(e: any) {
    this.remarkshow = e.qualityCheckRemark || 'No Remark Available';
  }
}
