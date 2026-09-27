import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
// import { ActionsComponent } from './actions/actions.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
// import { TravelExpenseWorkflowLevelDialogComponent } from '../travel-expense/travel-expense-workflow-level/travel-expense-workflow-level-dialog.component';
// import { OtherExpenseWorkflowLevelComponent } from './other-expense-workflow-level/other-expense-workflow-level.component';

@Component({
  selector: 'app-other-expense-workflow-level',
  templateUrl: './other-expense-workflow-level.component.html',
  styleUrls: ['./other-expense-workflow-level.component.scss']
})
export class OtherExpenseWorkflowLevelComponent {
  cellData: any;
  getData: any = [];
  serviceType: string;
  getdataCopy: any;
  notCreatedFlow: boolean = true;
  loginUser: any;
  remarkshow: any;
  constructor(
    public dialog: MatDialogRef<OtherExpenseWorkflowLevelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastrService,
    private route: Router,
    private travel_service: TravelRequestService,

  ) {
    this.cellData = this.data;
  }

  ngOnInit(): void {
    this.localStorage();
    this.get_all_approval_level();
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
  }

  getAllApproverList() {

  }

  view(e:any){
    this.remarkshow=e.remark || "Remark Unavailable";
  }


  get_all_approval_level() {
    let data = {
      department_id: this.cellData?.department_id,
      employeeId: this.cellData?.employee_id
    }
    this.travel_service.get_all_approver_level(this.cellData?.id, data).subscribe((res: any) => {
      this.notCreatedFlow = false;
      this.getdataCopy = res.data
    },
      ((err: any) => {
        if (err.status == 400) {
          this.notCreatedFlow = true;
        }
      })
    )
  }


}
