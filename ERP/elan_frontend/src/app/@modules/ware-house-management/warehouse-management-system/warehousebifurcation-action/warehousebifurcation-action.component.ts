import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-warehousebifurcation-action',
  templateUrl: './warehousebifurcation-action.component.html',
  styleUrls: ['./warehousebifurcation-action.component.scss']
})
export class WarehousebifurcationActionComponent {
  warehouse_bifurcation_id:any;
  params!: ICellRendererParams;
  
  constructor(private route: Router,
    public dialog: MatDialog,
    private toast: ToastrService,
    // private location: Location,
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
  this.params = params;               // ✅ IMPORTANT LINE
  this.cellValue = this.getValueToDisplay(params);

  // agar row se id chahiye
  this.warehouse_bifurcation_id = params.data?.id;
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
  console.log('ROW ID:', this.cellValue);
  console.log('WAREHOUSE ID:', this.warehouse_bifurcation_id);
  console.log('CONTEXT:', this.params?.context);
  console.log('FULL ROW:', this.params?.data);

  e.stopPropagation();

  this.route.navigate(
    ['/master/warehouse-management/warehouse-bifurcation/warehouse-new-bircation'],
    { queryParams: { id: this.params?.data.warehouse_id } }
  );
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

  view(e:any){
     this.route.navigate(['master/warehouse-management/warehouse-bifurcation/warehouse-new-bircation'], { queryParams: { id: this.cellValue } })

  }

  dragDrop(e:any){
    this.route.navigate(['master/warehouse-management/warehouse-bifurcation/warehouse-design'], { queryParams: { id: this.warehouse_bifurcation_id } })

  }
}


