import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { AreaDilogComponent } from '../area-dilog/area-dilog.component';

@Component({
  selector: 'app-area-action',
  templateUrl: './area-action.component.html',
  styleUrls: ['./area-action.component.scss'],
})
export class AreaActionComponent {
  assignAction: any;
  area_name: any;
  department_name: any;
  department_id: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService
  ) {}

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
  rowData:any
  agInit(params: ICellRendererParams): void {
    this.rowData = params.data;
    this.cellValue = this.getValueToDisplay(params);
    // this.area_name = params.data?.area_name;
    // this.department_name = params.data?.department_name;
    // this.department_id = params.data?.department_id;
  
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    const dialogRef = this.dialog.open(AreaDilogComponent, {
      data: {
        id: this.cellValue,
       
      },
      width: '25%',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  view(e: any) {
    const dialogRef = this.dialog.open(AreaDilogComponent, {
      data: {
        id: this.cellValue,
        view: 'view',
      },
      width: '25%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._configurationalMasterService
          .areaMasterDelete(this.cellValue)
          .subscribe(
            (res) => {
              this.toaster.success('Deleted successfully ');
              this.reloadCurrentRoute();
            },
            (err) => {
              this.toaster.error(
                'Somthing went wrong Please try agin',
                'Error Message'
              );
            }
          );
      }
    });
  }
}
