import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';
import { FinaceService } from 'src/app/@shared/services/finace.service';
@Component({
  selector: 'app-budget-planning-list',
  templateUrl: './budget-planning-list.component.html',
  styleUrls: ['./budget-planning-list.component.scss']
})
export class BudgetPlanningListComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  assignAction: any;
  fYearData: any;
  page: any;
  activeTab: string = 'Opex';
  show:any = false;
  workFlowError: any = true;
  user_id:any;
  departments:any;
  entity_id:any;
  workflowList:any;
  dept_id:any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private finance: FinaceService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    let loginUser: any = localStorage.getItem('signInUser');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.user_id = JSON.parse(loginUser).employee_id;
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.page = params.page;
      this.dept_id = params.dept_id;
      this.show = params.show; 
      this.activeTab = params.type;
      this.setActiveButton(this.page);
      if(this.id) {
        this.getBudgetPlan(this.id)
      }
    });
    this.setActiveButton(this.page);
    this.getDepartment();
    this.getWorkflowList();
    if(this.id) {
      this.getBudgetPlan(this.id)
    }
  }

  getBudgetPlan = (id : any) => {
    this.finance.getBudgetPlanById(id).subscribe((res: any) => {
      this.fYearData = res.data;
    })
  }

  getWorkflowList() {
    this._configurationalMasterService.getAllWorkFlowJob(this.entity_id).subscribe((res: any) => {
      this.workflowList = res.data;
      // this.rowData = res.data.filter((item:any)=>item?.status == "ACTIVE")
    },
    ((err:any)=>{
      this.workflowList=[]
      this.toaster.error(`${err.error.message}`)
    })
    )
  }

  toggle(tab: string) {  
    this.activeTab = tab;
    let flag = false;
    if (this.page == 'pending-for-approval'){
      flag = true;
    }
    this.route.navigate([`/master/finance/budget-planning/budget-planning-list/${this.page}`], { queryParams: { id: this.id, type: this.activeTab, page: this.page,show: this.show  },skipLocationChange: true})
  }

  getDepartment = () => {
    this._configurationalMasterService.getAllDepartment_all_active(this.entity_id).subscribe((res: any) => {
      this.departments = res.data;
    },(err: any) => {
      this.departments = [];
    })
  }

  redirect = () => {
    setTimeout(() => {
      this.finance.getBuisnessUnit( this.user_id).subscribe((res: any) => {
        let check = false;
        let dCheck = false;
        this.departments.map((department:any) => {
          if ( department.dept_id == res.data.department_id ) {
            dCheck = true;
            this.workflowList.map((workflow:any) => {
              if ( workflow.job_name == 'Budget Planning'){
                if (workflow.department_name == department.department_name && workflow.budget_planning_type == this.activeTab) 
                {
                  check = true;
                }
              }
            })
            if (!check) {
              this.workFlowError = true;
              this.toaster.warning(`Workflow is not created for this department ${department.department_name} and type ${this.activeTab}`)
            }else {
              this.workFlowError = false;
            }
            if ( this.page == 'planning' && !this.workFlowError){
              this.route.navigate(['master/finance/budget-planning/create-budget-planning'], { queryParams: { id: this.id, type: this.activeTab, page: this.page},skipLocationChange: true})
            }
          }
        })
        if (!dCheck) {
          this.toaster.warning(`Department not found`)
        }
      }
    )},500)
  }

  setActiveButton(page: string) {
    // Remove active state from all buttons initially
    const buttons = document.querySelectorAll('.tab-item button');
    buttons.forEach(button => button.classList.remove('active_button'));
    // Set active state to the corresponding button
    switch (page) {
     
      case 'planning':
        document?.querySelector('button[routerLink="planning"]')?.classList.add('active_button');
        break;
      case 'pending-for-approval':
        document?.querySelector('button[routerLink="pending-for-approval"]')?.classList.add('active_button');
        break;
      case 'approved-by-me':
        document?.querySelector('button[routerLink="approved-by-me"]')?.classList.add('active_button');
        break;
      case 'draft':
        document?.querySelector('button[routerLink="draft"]')?.classList.add('active_button');
        break;
      default:
        break;
    }
  }
}


