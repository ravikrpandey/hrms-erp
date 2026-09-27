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
    private toast: ToastrService,
    private location: Location,
    private $warehouseList : warehouseListService
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

  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {

    e.stopPropagation();

    // this.route.navigate(['master/itticket/configurational-master/product-master/create'], { queryParams: { id: this.cellValue } })
    this.route.navigate(["master/warehouse-management/warehouse-create"],{ queryParams: { id: this.cellValue } });
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
          this.$warehouseList.deleteWarehouse(this.cellValue).subscribe(res => {
            window.location.reload();
          })
        // Swal.fire(
        //   'Deleted!',
        //   'Your imaginary file has been deleted.',
        //   'success'
        // )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
      }
    })
  }
  openDialog() {
    // const dialogRef = this.dialog.open(ProductMasterDialogComponent, {
    //   data: { id: this.cellValue }
    // });
    // dialogRef.afterClosed().subscribe(result => {

    // });
  }

}


