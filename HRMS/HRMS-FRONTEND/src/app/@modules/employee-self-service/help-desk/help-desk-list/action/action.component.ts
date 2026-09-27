import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { HelpDeskDialogComponent } from '../../help-desk-dialog/help-desk-dialog.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  assignAction:any;
  
  constructor(private route: Router,
    public dialog: MatDialog,
    private emp_master: EmpMasterService,
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
    
    return params.valueFormatted ? params.valueFormatted : params.data.employee_helpDesk_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(['master/ess/help-disk/help-disk-create'], { queryParams: { id: this.cellValue } })
  }

  delete(e: any) {
    
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      // text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#5d6c7c",
      confirmButtonColor: "#f44336",
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Skip'
    }).then((result) => {
      if (result.value) {
        
        this.emp_master.deleteHelpDesk(this.cellValue).subscribe(res => {
          window.location.reload();
        })
        // Swal.fire(
        //   'Deleted!',
        //   'Your imaginary file has been deleted.',
        //   'success'
        // )
      } else if (result.dismiss === Swal.DismissReason.cancel as any) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
      }
    })




  }



  openDialog() {
    const dialogRef = this.dialog.open(HelpDeskDialogComponent, {
      data: { id: this.cellValue }
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

}
