
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICellRendererParams } from 'ag-grid-community';
import { SelfAssessmentService } from '../self-assessment.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
@Component({
  selector: 'app-action-assessment',
  templateUrl: './action-assessment.component.html',
  styleUrls: ['./action-assessment.component.scss']
})
export class ActionAssessmentComponent {
  yearly_assessment_id: any;
  assignAction: any;
  selectedType: any;
  params: ICellRendererParams<any, any>;
  finYear_id: any;
  assessment_name: any;
  employee_id: any;
  entity_id: any;
  loginUser: any;
  id: any =[];
  primary_key_id: any;
  status: any;
  reportingManagerId: any=[]
  approvalManagerId: any=[]
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private selfAssessmentService: SelfAssessmentService,
    private toaster: ToastrService,
    private _rbackService: RbacMasterService,
     private _commonService: CommonService,
  ) {
  }
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.selfAssessmentService.currentReportingManagerId.subscribe((res:any) => {
      this.reportingManagerId = res;
     
    });
    this.selfAssessmentService.currentApprovalManagerId.subscribe((res:any) => {
      this.approvalManagerId = res;
      
    });

  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.status = this.params.data.status
    this.finYear_id = params?.data.financial_year_id;
    this.id = params.data.assessment_id;
    this.primary_key_id = params.data.id;
    let entity: any = localStorage.getItem('selectedEntityId');
    this.entity_id = JSON.parse(entity);
    this.cellValue = this.getValueToDisplay(params);
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.employee_id = this.loginUser.employee_id;
    this.employee_id = params.data.user_id;

    if (this.params.data.month) {
      this.selectedType = 'feedback';
    }
    else {
      this.selectedType = 'Assessment';
    }
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.emptype_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }



  openComponent(mode: any): void {
    this._commonService.showLoader();
    if (this.approvalManagerId === "ApprovalManager") {
      this.router.navigate(['master/performance/team-performance-assessment/Approval-Manager'], {
        queryParams: {
          primary_key_id: this.primary_key_id,
          id: this.id,
          financial_year_id: this.finYear_id,
          entity_id: this.entity_id,
          employee_id: this.employee_id,
          type: this.selectedType,
          mode: mode
        }
      }).then(() => {
      }).catch(err => {
      });
      this.approvalManagerId = true; 
      this.reportingManagerId = false; 
      this.reportingManagerId = null
      return; 
    }
  
  
    if (this.reportingManagerId === "ReportingManager") {
      console.log('Navigating to Reporting Manager Component');
      this.router.navigate(['master/performance/team-performance-assessment/create-assessement'], {
        queryParams: {
          primary_key_id: this.primary_key_id,
          id: this.id,
          financial_year_id: this.finYear_id,
          entity_id: this.entity_id,
          employee_id: this.employee_id,
          type: this.selectedType,
          mode: mode
        }
      }).then(() => {
      }).catch(err => {
      });
      this.reportingManagerId = true; 
      this.approvalManagerId = false;  
      this.approvalManagerId = null
      return;
    }
  
  }
  
  viewSelfAssessment() {
    this.route.navigate(['master/performance/team-performance-assessment/create-assessement'], { queryParams: { id: this.id, financial_year_id: this.finYear_id, type: this.selectedType } });

  }



}
