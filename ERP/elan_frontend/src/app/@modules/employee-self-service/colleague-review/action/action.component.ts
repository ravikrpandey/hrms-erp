import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionColleagueReview implements OnInit {
  employee_complaint_id: any;
  assignAction: any;

  constructor(private route: Router, private recruitservice : RecruitService ,private _rbackService : RbacMasterService,
    public dialog: MatDialog, private toast: ToastrService, private recruitService: RecruitService) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    
  }
  public cellValue: any;


  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }

  getValueToDisplay(params: ICellRendererParams) {
    
    return params.data.id;
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  
  edit(e:any) {
    e.stopPropagation();
    // 
    this.route.navigate(['master/ess/colleague-review/add'], { queryParams: { id: this.cellValue } })
    // edit(e: any) {
    //   e.stopPropagation();
    // }
  }
  view() {
    // 
    // this.route.navigate(['ess/complaint-create'], { queryParams: { id: this.cellValue } })
    // edit(e: any) {
    //   e.stopPropagation();
    // }
  }

}
