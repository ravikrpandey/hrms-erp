import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { GlobalMinutesDialogComponent } from '../global-minutes-dialog/globalminutes-dialog.component';

@Component({
  selector: 'app-globalminutes-action',
  templateUrl: './globalminutes-action.component.html',
  styleUrls: ['./globalminutes-action.component.scss']
})
export class GlobalMinutesActionComponent {
  singleId: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
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


    return params.data.global_minutes_id
  }

  createDepartment(data: any) {
    this._configurationalmasterService.createDesignation(data).subscribe(
      (res: any) => {

        this.toaster.success('Designation Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {

        this.toaster.error("designation_name is All Ready Exits!", 'Error Message');
      }
    )
  };

  openDialog() {
    const dialogRef
      = this.dialog.open(GlobalMinutesDialogComponent, {
        width: '30%',
        data: { id: this.cellValue, view: 'visible' }
      });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  editDesig: any = 'Designation'
  edit(event: any) {
    const dialogRef
      = this.dialog.open(GlobalMinutesDialogComponent, {
        width: '30%',
        data: { id: this.cellValue, edit: this.editDesig },
      });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  delete(event: any) {
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._configurationalmasterService.delete_minute(this.cellValue).subscribe(
          (res) => {

            this.toaster.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")

          }
        )
      }
    });
  }


}
