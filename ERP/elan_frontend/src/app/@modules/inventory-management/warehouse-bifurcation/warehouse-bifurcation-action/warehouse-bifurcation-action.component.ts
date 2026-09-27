import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-warehouse-bifurcation-action',
  templateUrl: './warehouse-bifurcation-action.component.html',
  styleUrls: ['./warehouse-bifurcation-action.component.scss']
})
export class WarehouseBifurcationActionComponent {

  warehouse_bifurcation_id: any;
  params!: ICellRendererParams;
  public cellValue: any;

  constructor(private route: Router,
    public dialog: MatDialog,
    private toast: ToastrService,
    private $warehouseList: warehouseListService
  ) {
  }


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = this.getValueToDisplay(params);
    this.warehouse_bifurcation_id = params.data?.id;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(
      ['/master/warehouse-management/warehouse-bifurcation/setup-warehouse-bifurcation'],
      { queryParams: { id: this.params?.data.warehouse_id } }
    );
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure want to Remove?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#063178",
      confirmButtonColor: "#f44336",
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Skip'
    }).then((result) => {
      if (result.value) {
        this.$warehouseList.deleteWarehouse(this.cellValue).subscribe(res => {
          window.location.reload();
        })
      }
    })
  }

  view(e: any) {
    this.route.navigate(['master/warehouse-management/warehouse-bifurcation/setup-warehouse-bifurcation'], { queryParams: { id: this.cellValue } })
  }

  dragDrop(e: any) {
    this.route.navigate(['master/warehouse-management/warehouse-bifurcation/warehouse-design'], { queryParams: { id: this.warehouse_bifurcation_id } })
  }
}
