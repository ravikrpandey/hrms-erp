import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigitalSignatureApprovalComponent } from './digital-signature-approval.component';

const routes: Routes = [{ path: '', component: DigitalSignatureApprovalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalSignatureApprovalRoutingModule { }
