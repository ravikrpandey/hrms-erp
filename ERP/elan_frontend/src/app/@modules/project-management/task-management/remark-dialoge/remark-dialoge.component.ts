import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StateComponent } from 'src/app/@modules/dialog-popup-components/state-dialog-popup/state/state.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ProjectManagementService } from '../../services/project-management.service';

@Component({
  selector: 'app-remark-dialoge',
  templateUrl: './remark-dialoge.component.html',
  styleUrls: ['./remark-dialoge.component.scss']
})
export class RemarkDialogeComponent {
  remarksForm: FormGroup;
  isRemarkInputVisible = false;
  remarksData: any[] = [];
  displayedColumns: string[] = ['employeeName', 'date', 'remarks'];
  isOpenDialog: boolean = false;
  entity_id: string | null;
  mainEmpId: string | null;
  task_id: any;
  project_id: any;
  constructor(
    private dialog: MatDialogRef<StateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _fb: FormBuilder,
    public activeroute : ActivatedRoute,
    public toaster: ToastrService,
    public router: Router,
    public _projectService : ProjectManagementService
  ) {
    this.remarksForm = this._fb.group({
      remarks: new FormControl(null, [Validators.required,]),
    });
  }

  ngOnInit(): void {
    const dialogeData = this.dialog?.componentInstance?.data;
    this.task_id = dialogeData?.id;
    this.project_id = dialogeData?.project_id;

    this.entity_id = localStorage.getItem('selectedEntityId');
    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.isOpenDialog = this.dialog?.componentInstance?.data?.isOpenDialog

    this.getAllRemarks()
  }


  confirmDialog() {
    this.dialog.close(this.remarksForm.value);
  }
  toggleRemarkInput(): void {
    this.isRemarkInputVisible = !this.isRemarkInputVisible;
  }

  getAllRemarks(){
    this._projectService.getAllRemarks(this.project_id,this.task_id).subscribe((res:any)=>{
      this.remarksData = res.data;
    })
  }
  onSubmit() {
    if (this.remarksForm.invalid) {
      this.remarksForm.markAllAsTouched();
      return;
    }
    const data = {
      employee_id : this.mainEmpId,
      project_id : this.project_id,
      task_id : this.task_id,
      remarks_date: new Date(),
      remarks : this.remarksForm.value.remarks
    }
    this._projectService.createRemarks(data).subscribe(
      (res: any) => {
        if (res) {
            this.toaster.success('Remarks Added Successfully.');
            this.dialog.close();
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
