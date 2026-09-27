import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorQuotationApprovalComponent } from './vendor-quotation-approval.component';
import { VendorQuotationFormComponent } from './vendor-quotation-form/vendor-quotation-form.component';

const routes: Routes = [
  { path: '', component: VendorQuotationApprovalComponent },
  { path: 'pending-approval-update', component: VendorQuotationFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorQuotationApprovalRoutingModule { }
