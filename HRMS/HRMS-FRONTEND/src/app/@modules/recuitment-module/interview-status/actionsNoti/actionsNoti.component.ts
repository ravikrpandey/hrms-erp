import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-actions',
  templateUrl: './actionsNoti.component.html',
  styleUrls: ['./actionsNoti.component.scss'],
})
export class ActionNotiComponent {
  candidate_id: any;
  constructor(
    private route: Router,
    public dialog: MatDialog
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
    
  }

  ngOnInit(): void {}
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
    this.route.navigate(['recruitment/interview-update'], {
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
