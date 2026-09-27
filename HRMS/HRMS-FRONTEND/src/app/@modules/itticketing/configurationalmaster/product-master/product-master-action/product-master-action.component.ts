import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductMasterDialogComponent } from '../product-master-dialog/product-master-dialog.component';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';

@Component({
  selector: 'app-product-master-action',
  templateUrl: './product-master-action.component.html',
  styleUrls: ['./product-master-action.component.scss']
})
export class ProductMasterActionComponent {
  assignAction:any;
    
  constructor(private route: Router,
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    private _rbackService:RbacMasterService,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
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
    this.route.navigate(['master/configurational-master/product-master/create'], { queryParams: { id: this.cellValue } })
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        
        this._configurationalMasterService.deleteProductMaster(this.cellValue).subscribe(res => {
          window.location.reload();
        })
        // Swal.fire(
        //   'Deleted!',
        //   'Your imaginary file has been deleted.',
        //   'success'
        // )
      } 
      // else if (result.dismiss === Swal.DismissReason.cancel) {
      //   // Swal.fire(
      //   //   'Cancelled',
      //   //   'Your imaginary file is safe :)',
      //   //   'error'
      //   // )
      // }
    })
  }
  openDialog(e:any) {
    // const dialogRef = this.dialog.open(ProductMasterDialogComponent, {
    //   data: { id: this.cellValue }
    // });
    // dialogRef.afterClosed().subscribe(result => {
      
    // });

    // const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { productMasterViewId: this.cellValue } });
    // dialogRef.afterClosed().subscribe(result => {

    // })

  }

}

