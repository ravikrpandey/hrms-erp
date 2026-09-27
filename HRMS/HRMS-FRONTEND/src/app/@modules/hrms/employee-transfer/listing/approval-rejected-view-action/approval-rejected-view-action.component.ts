import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeTransferService } from 'src/app/@shared/services/employee-transfer.service';

@Component({
  selector: 'app-approval-rejected-view-action',
  templateUrl: './approval-rejected-view-action.component.html',
  styleUrls: ['./approval-rejected-view-action.component.scss'],
})
export class ApprovalRejectedViewActionComponent {
  params: any;
  selectedType: any;
  id: any;
  IsStatus: any;
  constructor(
    private router: Router,
    private employeeTransfer: EmployeeTransferService,
    private toster: ToastrService
  ) {}

  agInit(params: any): void {
    this.params = params;
    this.id = params.data.id;
    this.IsStatus = params.data.IsStatus;
  }

  viewDetails() {
    this.router.navigate(['/master/hrms/employee-transfer/ApprovalForm'], {
      queryParams: { type: this.selectedType, mode: 'view', id: this.id },
    });
  }

  EmployeeTransfer() {
    this.router.navigate(['/master/hrms/employee-transfer/ApprovalForm'], {
      queryParams: { id: this.id },
    });
  }
}
