import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationApprovalComponent } from './quotation-approval.component';
import { QuotationApprovalActionComponent } from './quotation-approval-action/quotation-approval-action.component';
import { QuotationApprovalCreateComponent } from './quotation-approval-create/quotation-approval-create.component';

const routes: Routes = [
  { path: '', component: QuotationApprovalComponent },
  { path: 'create', component: QuotationApprovalCreateComponent },
  { path: 'action', component: QuotationApprovalActionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationApprovalRoutingModule { }
