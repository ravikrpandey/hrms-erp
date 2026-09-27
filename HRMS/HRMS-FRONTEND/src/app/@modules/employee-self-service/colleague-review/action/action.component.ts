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
  public cellValue: any;
  submit_assessment_id: any
  yearly_assessment_id: any
  employee_id: any;
  entity_id: any
  constructor(private route: Router, private recruitservice: RecruitService, private _rbackService: RbacMasterService,
    public dialog: MatDialog, private toast: ToastrService, private recruitService: RecruitService) {
  }


  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();

  }


  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.submit_assessment_id = params.data?.submit_assessment_id || null;
    this.yearly_assessment_id = params.data?.yearly_assessment_id || null;
    this.employee_id = params.data?.employee_id || null;
    this.entity_id = params.data?.entity_id || null;
  }


  getValueToDisplay(params: ICellRendererParams) {
    return params.data.id;
  }


  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }


  view() {
    this.route.navigate(['master/ess/colleague-review/add'], { queryParams: { submit_assessment_id: this.submit_assessment_id, yearly_assessment_id: this.yearly_assessment_id, employee_id: this.employee_id, entity_id: this.entity_id  , mode:"view"} })
  }


  

}
