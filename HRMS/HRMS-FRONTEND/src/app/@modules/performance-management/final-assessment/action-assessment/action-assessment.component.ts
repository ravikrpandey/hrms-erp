import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICellRendererParams } from 'ag-grid-community';
import { SelfAssessmentService } from 'src/app/@modules/employee-self-service/self-assessment/self-assessment.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-action-assessment',
  templateUrl: './action-assessment.component.html',
  styleUrls: ['./action-assessment.component.scss']
})
export class ActionAssessmentComponent {
  yearly_assessment_id: any;
  assignAction: any;
  selectedType:any;
  params: ICellRendererParams<any, any>;
  finYear_id: any;
  assessment_name: any;
  employee_id: any;
  entity_id: any;
  loginUser: any;
  id: any;
  primary_key_id: any;
  status:any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private selfAssessmentService:SelfAssessmentService,
    private toaster: ToastrService,
    private rbacService : RbacMasterService
  ) {
  }
  ngOnInit(): void {
    this.assignAction = this.rbacService.accessAssignAction();
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
    console.log("+++++++++",params.data)
    this.status = this.params.data.status
    this.finYear_id = params?.data.financial_year_id;  
    this.id = params.data.assessment_id;
    this.primary_key_id = params.data.id;
    let entity: any = localStorage.getItem('selectedEntityId');
    this.entity_id = JSON.parse(entity);
    this.cellValue = this.getValueToDisplay(params);
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.employee_id = params.data.employee_id;
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

  openComponent() {
    this.route.navigate(['/master/performance/final-assessment/final'], { queryParams: { id: this.params.data.assess_id ,dept_id:this.params.data.dept_id, mode: 'view',employee_id:this.employee_id, status:this.status , type:'assessment'}});
  }

  viewSelfAssessment() {
    this.router.navigate(['master/performance/team-performance-assessment/create-assessement'], { queryParams: { id: this.id,financial_year_id: this.finYear_id, type: this.selectedType } });
  }

}
