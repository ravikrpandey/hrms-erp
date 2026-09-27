import { Component, OnInit } from '@angular/core';
import {
  GridApi, GridReadyEvent,
  ICellRendererParams
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-action-announcement',
  templateUrl: './action-announcement.component.html',
  styleUrls: ['./action-announcement.component.scss']
})
export class ActionAnnouncementComponent {

  employee_complaint_id: any;
    assignAction: any;
  
    constructor(private route: Router, private recruitservice : RecruitService ,private _rbackService: RbacMasterService,
      public dialog: MatDialog, private toast: ToastrService, private recruitService: RecruitService) {
    }
  
    ngOnInit(): void {
      this.assignAction = this._rbackService.accessAssignAction();
    }
    public cellValue: any;
  
    singleData: any;
    agInit(params: ICellRendererParams): void {
      this.cellValue = this.getValueToDisplay(params);
      this.singleData = params.data;
    }
  
    getValueToDisplay(params: ICellRendererParams) {
  
      return params.data;
    }
    refresh(params: ICellRendererParams): boolean {
      // set value into cell again
  
      this.cellValue = this.getValueToDisplay(params);
      return true;
    }
  
    edit(e:any) {
      e.stopPropagation();

      this.route.navigate(['master/hrms/announcement/create-announcement'], { queryParams: { id: this.cellValue?.id } })
      
      // edit(e: any) {
      //   e.stopPropagation();
      // }
    }
  
    // delete(e:any){
  
    //   const data = {
    //     employee_complaint_id: this.cellValue
    //   }
    //   this.employee_complaint_id = Number(this.cellValue)
    //   this.recruitService.deleteComplaint(this.employee_complaint_id).subscribe((res:any)=>{
  
    //     this.toast.success('Complaint Deleted successfully!');
    //     window.location.reload();
    //   })
    //   e.stopPropagation();
  
  
    // }
  
  
  
    openDialog() {
      this.route.navigate(['master/hrms/announcement/create-announcement'], { queryParams: { id: this.cellValue?.id, status:'view' } })
    }
  

  }
