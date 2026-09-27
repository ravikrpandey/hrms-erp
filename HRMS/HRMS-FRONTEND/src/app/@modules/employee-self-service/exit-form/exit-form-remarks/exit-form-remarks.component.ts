import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExitFormService } from '../exit-form-service';

@Component({
  selector: 'app-exit-form-remarks',
  templateUrl: './exit-form-remarks.component.html',
  styleUrls: ['./exit-form-remarks.component.scss'],
})
export class ExitFormRemarksComponent implements OnInit {
  resignation_id: any;
  exit_form_id: any;

  approverName: string = '';
  status: string = '';
  remarks: string = '';
  exit_code: string = '';

  constructor(
    public dialog: MatDialogRef<ExitFormRemarksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private exitFormService: ExitFormService
  ) {
    this.resignation_id = this.data.resignation_id;
    this.exit_form_id = this.data.exit_form_id;
  }

  ngOnInit(): void {
    this.getExitFormRemarks();
  }

  getExitFormRemarks() {
    this.exitFormService.getExitFormDetailsById(this.exit_form_id).subscribe(
      (res: any) => {
        this.approverName = res?.data?.approver_name || '-';
        this.status = res?.data?.approval_status || '-';
        this.remarks = res?.data?.approver_remarks || '-';
        this.exit_code = res?.data?.exit_form_code || '-';
      },
      (err) => {
        console.error('Error fetching remarks', err);
      }
    );
  }
}
