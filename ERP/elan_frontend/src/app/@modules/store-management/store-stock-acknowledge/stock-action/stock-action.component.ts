import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FGListService } from 'src/app/@shared/services/warehouse/fg-list.service';
import { StoreManagementService } from '../../store-management.service';

@Component({
  selector: 'app-stock-action',
  templateUrl: './stock-action.component.html',
  styleUrls: ['./stock-action.component.scss']
})

export class StockActionComponent {
  singleData: any;
  constructor(private route: Router,
    public dialog: MatDialog,
    private StoreService: StoreManagementService,
    private toast: ToastrService,
  ) {
  }

  ngOnInit(): void {
  }
  
  public cellValue: any;

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(["/master/warehouse-management/stock-list/stock-status"], { queryParams: { id: this.cellValue } });
  }

  approveAction() {
    const rowData = this.singleData.data;
    Swal.fire({
      title: 'Do you want to approve/reject this request ?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Approve',
      cancelButtonText: 'Reject'
    }).then((result: any) => {

      if (result.isConfirmed) {
        const data = {
          ...rowData,
          "stockReq": "Approved",
          "stock_transfer_id": this.singleData.data.stock_transfer_id,
        };

        this.StoreService.stockActionRequest(data).subscribe((res: any) => {
          if (res.code == 200) {
            this.toast.success('Request has been approved successfully')
            this.reloadCurrentRoute();

          }

        })
      }
      if (result.dismiss === 'cancel') {
        const data = {
          ...rowData,
          "stockReq": "Rejected",
          "stock_transfer_id": this.singleData.data.stock_transfer_id,
        };

        this.StoreService.stockActionRequest(data).subscribe((res: any) => {
          if (res.code == 200) {
            this.toast.success('Request has been rejected successfully')
            this.reloadCurrentRoute();

          }

        })
      }
    });
  }

}