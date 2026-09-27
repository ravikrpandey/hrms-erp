import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-service-center-action',
  templateUrl: './service-center-action.component.html',
  styleUrls: ['./service-center-action.component.scss']
})
export class ServiceCenterActionComponent {
  assignAction:any;
  public cellValue: any;

  constructor(private route: Router,
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    private _rbackService:RbacMasterService,
    private location: Location,
    private activeroute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
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
  openDialog(e: any) {
    e.stopPropagation();
    this.route.navigate(['master/configurational-master/service-center/create'], { queryParams: { id: this.cellValue, role:'view' } });
  }

  // Set mode to 'update' when the 'Edit' icon is clicked
  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(['master/configurational-master/service-center/create'], { queryParams: { id: this.cellValue, role:'edit' } });
  }
  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure want to Remove?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        
        this._configurationalMasterService.deleteServicecenterMaster(this.cellValue).subscribe(res => {
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
  // openDialog(e:any) {
  //   // const dialogRef = this.dialog.open(ProductMasterDialogComponent, {
  //   //   data: { id: this.cellValue }
  //   // });
  //   // dialogRef.afterClosed().subscribe(result => {
      
  //   // });

  //   // const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { productMasterViewId: this.cellValue } });
  //   // dialogRef.afterClosed().subscribe(result => {

  //   // })

  // }

}