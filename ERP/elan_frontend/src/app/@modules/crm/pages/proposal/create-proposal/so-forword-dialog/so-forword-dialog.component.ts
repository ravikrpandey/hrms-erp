import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { version } from 'os';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Component({
  selector: 'app-so-forword-dialog',
  templateUrl: './so-forword-dialog.component.html',
  styleUrls: ['./so-forword-dialog.component.scss'],
})
export class SoForwordDialogComponent implements OnInit {
  remarkshow: any;
  workflowList: any[] = [];
  login_role_id: any;
  login_id: any;
  reportingManagerId: any;

  credit_remark: FormControl = new FormControl(null, [Validators.required]);

  constructor(private accessData: AccessControlService,
    public dialog: MatDialogRef<SoForwordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private proposalService: ProposalService
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    this.login_id = this.accessData.getEmployeeId(); 
    this.login_role_id = this.accessData.getRoleId();
    this.getWorkflowData();
  }

  getWorkflowData() {
    const data = {
      proposal_id: this.data.proposal_id,
      version_id: this.data.version_id,
      sales_booking_id: this.data.sales_booking_id,
    };
    this.proposalService
      .getCreditWorklowApprovalList(data)
      .subscribe((response: any) => {
        this.workflowList = response.data;
        this.reportingManagerId = this.workflowList[0]?.reporting_manager_id;
      });
  }

  onSubmit() {
    this.credit_remark.markAsTouched();
    if (this.credit_remark.valid) {
      const data = {
        proposal_id: this.data.proposal_id,
        version_id: this.data.version_id,
        sales_booking_id: this.data.sales_booking_id,
        credit_remark: this.credit_remark.value,
        isSubmit: true
      };
      this.dialog.close(data);
    }
  }

  onRemark(remark: string) {
    this.remarkshow = remark;
    this.credit_remark.setValue(remark);
  }
}
