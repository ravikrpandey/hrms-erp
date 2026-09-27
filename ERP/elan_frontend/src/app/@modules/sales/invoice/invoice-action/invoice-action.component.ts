import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-invoice-action',
  templateUrl: './invoice-action.component.html',
  styleUrls: ['./invoice-action.component.scss']
})
export class InvoiceActionComponent {

  params: any;
  planningId: string = '';
  showButton: boolean = false;
  cellValue: any;

  constructor(private toaster: ToastrService, private apiUrl: warehouseListService, private route: Router) { }

  agInit(params: any): void {
    this.params = params;
    const data = params.data;
    this.planningId = data.id;
    this.cellValue = this.getValueToDisplay(params);

    if (data.pickList_status === 'Pending') {
      this.showButton = true;
    }
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.data;
  }
  refresh(params: any): boolean {
    return false;
  }

  ViewAction(e: any) {

    e.stopPropagation();
    this.route.navigate(['/master/sales/invoice-list/invoice-view'], {
      queryParams: {
        id: this.cellValue.id,
        action_type: 'view',

      },
    });
  }

  downloadInvoice(e: any) {
    e.stopPropagation();
    const id =this.cellValue.id;
    this.apiUrl.downloadDispatchPickList(id).subscribe({
      next: (blob: Blob) => {

        console.log('Blob Size:', blob.size);
        console.log('Blob Type:', blob.type);

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `DispatchPackingList_${id}.pdf`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  revalidateItems() {
    let obj = { id: this.planningId }
    this.apiUrl.updatePickData(obj).subscribe((res: any) => {
      this.toaster.success(res.message);
      window.location.reload();
    },
      (error) => {
        this.toaster.error(error.error.message);
      })
  }

}