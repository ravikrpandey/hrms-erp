import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-travel-expense-workflow-dialog',
  templateUrl: './travel-expense-workflow-level-dialog.component.html',
  styleUrls: ['./travel-expense-workflow-level-dialog.component.scss']
})
export class TravelExpenseWorkflowLevelDialogComponent {
  cellData: any;
  getData: any = [];
  serviceType: string;
  getdataCopy: any;
  notCreatedFlow: boolean = true;
  loginUser: any;
  remarkshow: any;
  constructor(
    public dialog: MatDialogRef<TravelExpenseWorkflowLevelDialogComponent>,
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
