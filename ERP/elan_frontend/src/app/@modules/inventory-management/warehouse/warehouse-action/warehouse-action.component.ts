import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-warehouse-action',
  templateUrl: './warehouse-action.component.html',
  styleUrls: ['./warehouse-action.component.scss']
})
export class WarehouseActionComponent {

  constructor(private route: Router,
    public dialog: MatDialog,
    private warehouseService: warehouseListService
  ) {
  }

  public cellValue: any;

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigateByUrl(currentUrl);
    });
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  view(e: any) {
    e.stopPropagation();
    this.route.navigate(["master/warehouse-management/warehouse/create"], { queryParams: { id: this.cellValue, mode: 'view' } });
  }

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(["master/warehouse-management/warehouse/create"], { queryParams: { id: this.cellValue, mode: 'edit' } });
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure want to Remove?',
      // text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#063178",
      confirmButtonColor: "#f44336",
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Skip'
    }).then((result) => {
      if (result.value) {
        this.warehouseService.deleteWarehouse(this.cellValue).subscribe((res: any) => {
          this.reloadCurrentRoute();
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }
}