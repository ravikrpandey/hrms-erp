import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StateComponent } from 'src/app/@modules/dialog-popup-components/state-dialog-popup/state/state.component';
import { ProjectManagementService } from '../../services/project-management.service';

@Component({
  selector: 'app-dialog-timesheet-approval',
  templateUrl: './dialog-timesheet-approval.component.html',
  styleUrls: ['./dialog-timesheet-approval.component.scss']
})
export class DialogTimesheetApprovalComponent {
  isOpenDialog: boolean = false;
  mainEmpId: string | null;
  timesheetForm: FormGroup<any>;
  timesheet_id: any;
  timesheetData: any;
  project_id: any;
  timesheet_approval_status: any;
  constructor(
    private dialog: MatDialogRef<StateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _fb: FormBuilder,
    public activeroute : ActivatedRoute,
    public toaster: ToastrService,
    public router: Router,
    public _projectService : ProjectManagementService
  ) {
    this.timesheetForm = this._fb.group({
      date: ['', Validators.required], 
      project_name: ['', Validators.required],
      task_name: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      total_hours: [''],
      billable: [false],
      non_billable: [false],
      remarks: [''],
      manager_comment : ['',Validators.required],
      manager_comments : ['']
    })
  }

  ngOnInit(): void {
    const dialogeData = this.dialog?.componentInstance?.data;
    this.timesheet_id = dialogeData?.id;
    this.project_id = dialogeData?.project_id;
    this.timesheet_approval_status = dialogeData?.timesheet_approval_status;

    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.isOpenDialog = this.dialog?.componentInstance?.data?.isOpenDialog
    this.getTimesheetById()
  }

  confirmDialog() {
    this.dialog.close(this.timesheetForm.value);
  }

  onCheckboxChange(field: string, event: any): void {
    if (field === 'billable') {
      this.timesheetForm.get('billable')?.setValue(event.checked);
      this.timesheetForm.get('non_billable')?.setValue(false);
    } else if (field === 'non_billable') {
      this.timesheetForm.get('non_billable')?.setValue(event.checked);
      this.timesheetForm.get('billable')?.setValue(false);
    }
  }

  getTimesheetById(){
    this._projectService.getTimesheetById(this.timesheet_id).subscribe((res:any)=>{
      this.timesheetData = res.data;

      const isBillable = this.timesheetData?.timesheet_type === 'BILLABLE';
      const isNonBillable = this.timesheetData?.timesheet_type === 'NON-BILLABLE';

      this.timesheetForm.patchValue({
        date: this.timesheetData?.timesheet_date,
        start_time: this.timesheetData?.start_time,
        end_time : this.timesheetData?.end_time,
        project_name: this.timesheetData?.project_name,
        task_name : this.timesheetData?.task_name,
        billable : isBillable,
        non_billable : isNonBillable,
        remarks : this.timesheetData?.remarks,
        total_hours: this.timesheetData?.total_hour,
        manager_comments : this.timesheetData?.manager_comments
      })
    })
  }
  onApprove() {
    if (this.timesheetForm.invalid) {
      this.timesheetForm.markAllAsTouched();
      return;
    }
    const data = {
      status : 'APPROVED',
      manager_comments : this.timesheetForm.value.manager_comment
    }
    this._projectService.updateTimesheetStatus(this.timesheet_id,data).subscribe(
      (res: any) => {
        if (res) {
            this.toaster.success('Timesheet Approved Successfully.');
            this.dialog.close();
            this.router.navigate(['master/project-management/approved-timesheet'])
            if (this.isOpenDialog === true) {
              this.confirmDialog();
            }
        }
      },
      (err: any) => {
        if (err.status == 500) {
          this.toaster.error('Something went Wrong!');
        }
      }
    );
  }
  onReject() {
    if (this.timesheetForm.invalid) {
      this.timesheetForm.markAllAsTouched();
      return;
    }
    const data = {
      status : 'REJECTED',
      manager_comments : this.timesheetForm.value.manager_comment
    }
    this._projectService.updateTimesheetStatus(this.timesheet_id,data).subscribe(
      (res: any) => {
        if (res) {
            this.toaster.success('Timesheet Rejected Successfully.');
            this.dialog.close();
            this.router.navigate(['master/project-management/rejected-timesheet'])
            if (this.isOpenDialog === true) {
              this.confirmDialog();
            }
        }
      },
      (err: any) => {
        if (err.status == 500) {
          this.toaster.error('Something went Wrong!');
        }
      }
    );
  }
}
