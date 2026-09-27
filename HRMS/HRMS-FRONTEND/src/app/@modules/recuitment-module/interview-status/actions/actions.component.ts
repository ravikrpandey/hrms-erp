import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionDupComponent {
  candidate_id: any;
  assignAction:any;
  
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _rbackService:RbacMasterService,

  ) {
    // this.data = localStorage.getItem("jobId");
    // 
    
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    this.candidate_id = params.data.candidate_id;
    return params.data.candidate_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    // 
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(['master/recruitment/interview-update'], {
      queryParams: { interview_id: this.cellValue },
    });
    // edit(e: any) {
    // e.stopPropagation();
    // }
  }

  delete(e:any) {
    Swal.fire({
      title: 'Do You Want to Reject Interview?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
  }
 
}
