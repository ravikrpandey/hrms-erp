import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeTransferlistComponent } from './employee-transferlist/employee-transferlist.component';
import { EmployeeTransferComponent } from './employee-transfer/employee-transfer.component';
import { PendingForApprovalComponent } from './listing/pending-for-approval/pending-for-approval.component';
import { ApprovalComponent } from './listing/approval/approval.component';
import { RejectedComponent } from './listing/rejected/rejected.component';
import { EmployeeListComponent } from './listing/employee-list/employee-list.component';
import { ApprovalFormComponent } from './listing/approval-form/approval-form.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeTransferlistComponent,
    children: [
      { path: '', redirectTo: 'my-Request', pathMatch: 'full' },
      { path: 'my-Request', component: EmployeeListComponent },
      { path: 'pending-for-approval', component: PendingForApprovalComponent },
      { path: 'approval', component: ApprovalComponent },
      { path: 'reject', component: RejectedComponent },
    ],
  },
  { path: 'transfer', component: EmployeeTransferComponent },
  { path: 'ApprovalForm', component: ApprovalFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeTransferRoutingModule {}
