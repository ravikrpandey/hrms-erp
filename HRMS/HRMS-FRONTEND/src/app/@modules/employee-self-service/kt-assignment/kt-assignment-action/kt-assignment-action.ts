import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { EmpListDialogComponent } from '../../employee/employee-list/emp-list-dialog/emp-list-dialog.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';

@Component({
  selector: 'app-kt-assignment-action',
  templateUrl: './kt-assignment-action.html',
  styleUrls: ['./kt-assignment-action.scss']
})
export class KtAssignmentAction {

   assignAction: any;
    constructor(private route: Router,
      public dialog: MatDialog,
      private employeeMasterService: EmpMasterService,
      private toster: ToastrService,
      private _rbackService: RbacMasterService,
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
      // 
      this.route.navigate(['/master/ess/kt-assignment/create-kt-assignment'],
        { queryParams: { id: this.cellValue,mode: 'editMode' } })
      // edit(e: any) {
      //   e.stopPropagation();
      // }
    }
  
   delete(e: any) {
  e.stopPropagation();

  Swal.fire({
    title: 'Are you sure?',
    text: "This KT Assignment will be deleted!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3f51b5',
    cancelButtonColor: '#f44336',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {

      this.employeeMasterService.deleteKtAssignment(this.cellValue)
        .subscribe({
          next: (res: any) => {
            this.toster.success('Deleted Successfully');
            this.reloadCurrentRoute();
          },
          error: () => {
            this.toster.error('Something went wrong!');
          }
        });
    }
  });
}

    openDialog() {
      const dialogRef
        = this.dialog.open(EmpListDialogComponent, {
          width: '100%',
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          panelClass: 'full-screen-modal',
          data: { id: this.cellValue }
        });
      dialogRef.afterClosed().subscribe(result => {
  
      });
    }
  
   view() {
  this.route.navigate(
    ['master/ess/kt-assignment/create-kt-assignment'],
    { queryParams: { id: this.cellValue, mode: 'viewMode' } }
  );
}

  
  
  

}
