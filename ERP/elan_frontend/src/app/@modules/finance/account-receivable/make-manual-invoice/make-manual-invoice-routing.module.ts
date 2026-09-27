import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MakeManualInvoiceComponent } from './make-manual-invoice.component';
import { PandingManualInvoiceComponent } from './panding-manual-invoice/panding-manual-invoice.component';
import { ApprvedManualInvoiceComponent } from './apprved-manual-invoice/apprved-manual-invoice.component';
import { RejectManualInvoiceComponent } from './reject-manual-invoice/reject-manual-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: MakeManualInvoiceComponent,
    children: [
      { path: '', redirectTo: 'pending-manual-invoice', pathMatch: 'full' },
      { path: 'pending-manual-invoice', component: PandingManualInvoiceComponent },
      {
        path: 'approved-manual-invoice',
        component: ApprvedManualInvoiceComponent,
      },

      { path: 'reject-manual-invoice', component: RejectManualInvoiceComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MakeManualInvoiceRoutingModule {}
