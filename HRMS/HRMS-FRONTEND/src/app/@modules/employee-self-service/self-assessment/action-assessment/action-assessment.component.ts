import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICellRendererParams } from 'ag-grid-community';
import { SelfAssessmentService } from '../self-assessment.service';
@Component({
  selector: 'app-action-assessment',
  templateUrl: './action-assessment.component.html',
  styleUrls: ['./action-assessment.component.scss']
})
export class ActionAssessmentComponent {
  paramsVal: any;
  assignAction: any;
  addDataParams: any = 'add';
  viewDataParams:any = 'view';
  params: ICellRendererParams<any, any>;
  finYear_id: any;
  assessment_name: any;
  employee_id:any;
  innitiateButtonCheck:any = false;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private selfAssessmentService:SelfAssessmentService,
    private toaster: ToastrService
  ) {
  }
  ngOnInit(): void {
    this.assignAction = this.selfAssessmentService.accessAssignAction();
    let a: any = localStorage.getItem('signInUser');
    a  = JSON.parse(a);
    this.employee_id = a.employee_id;
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
    let a: any = localStorage.getItem('signInUser');
    a  = JSON.parse(a);
    this.employee_id = a.employee_id;
    this.finYear_id = params?.data.financial_year_id;
    this.assessment_name =  params?.data.assessment_name;
    this.paramsVal = params.data.id;
    this.cellValue = this.getValueToDisplay(params);
    if ( this.params.data.status == 'Pending For Self Assessment') {
      this.innitiateButtonCheck = this.checkDateRange(this.params.data);
    }
  }

  checkDateRange(data:any){
    // if today lies between data.start_date and data.end_date, return true else return false;
    const today = new Date();
  
    // Ensure the dates are in proper Date format
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
  
    // Normalize the dates to avoid time portion issues
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
  
    // Check if today's date is between startDate and endDate
    return today >= startDate && today <= endDate;
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
    this.router.navigate(['master/ess/self-assessment/create-self-assessemnt'], { queryParams: { id: this.paramsVal, financial_year_id: this.finYear_id,assessment_name: this.assessment_name, type: this.addDataParams, employee_id: this.employee_id,mode:"innitiate"  } });
  }

  
  openComponent2() {
    this.router.navigate(['master/ess/self-assessment/create-self-assessemnt'], { queryParams: { id: this.paramsVal, financial_year_id: this.finYear_id,assessment_name: this.assessment_name, type: this.addDataParams, employee_id: this.employee_id  } });
  }

  viewSelfAssessment() {
    this.router.navigate(['master/ess/self-assessment/create-self-assessemnt'], { queryParams: { id: this.paramsVal,financial_year_id: this.finYear_id, type: this.viewDataParams, employee_id: this.employee_id, mode:"view"  } });
  }
  editAssessment() {
    this.router.navigate(['master/ess/self-assessment/create-self-assessemnt'], { queryParams: { id: this.paramsVal,financial_year_id: this.finYear_id, type: this.viewDataParams, employee_id: this.employee_id, mode: "edit"  } });
    // this.router.navigate(['master/ess/self-assessment/create-self-assessemnt'], { queryParams: { id: this.paramsVal,financial_year_id: this.finYear_id, type: this.viewDataParams, employee_id: this.params?.data.employee_id  } });
  }

}
