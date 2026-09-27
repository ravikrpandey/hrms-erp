import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { SealTypeDialogComponent } from '../seal-type-dialog/seal-type-dialog.component';

@Component({
  selector: 'app-seal-type-ac',
  templateUrl: './seal-type-action.component.html',
  styleUrls: ['./seal-type-action.component.scss']
})
export class SealTypeActionComponent {
  cellValue: any;
  assignAction: any;
  constructor(private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toster: ToastrService) { }
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {

    return params.data.id;
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  Delete(e: any) {
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
      if (result.isConfirmed) {
        this._configurationalmasterService.deleteSealType(this.cellValue).subscribe(
          (res: any) => {
            this.toster.success("Deleted successfully")
            this.reloadCurrentRoute();
          }, (err) => {
            this.toster.error('Something went wrong please try again', 'Error Message')
          }
        )
      };
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(SealTypeDialogComponent, {
      data: { mode : 'view', id: this.cellValue },
      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result) => {

    });

  }
  editData(event: any) {
    const dialogRef = this.dialog.open(SealTypeDialogComponent, {
      data: {  id: this.cellValue },
      width: '35%',
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
  }


}





