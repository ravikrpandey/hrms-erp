import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerApprovalComponent } from './customer-approval.component';
import { CustomerApprovalCreateComponent } from './customer-approval-create/customer-approval-create.component';
import { CustomerApprovalActionComponent } from './customer-approval-action/customer-approval-action.component';

const routes: Routes = [
  { path: '', component: CustomerApprovalComponent },
  { path: 'create', component: CustomerApprovalCreateComponent },
  { path: 'action', component: CustomerApprovalActionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerApprovalRoutingModule { }
