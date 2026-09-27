import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceRequestComponent } from './invoice-request.component';
import { RaiseInvoiceComponent } from './raise-invoice/raise-invoice.component';
import { ManualInvoiceComponent } from './manual-invoice/manual-invoice.component';
import { InvoiceRequestCreateComponent } from './invoice-request-create/invoice-request-create.component';
// import { InvoiceRequestListComponent } from 'src/app/@modules/audit/pre-audit/invoice-request-list/invoice-request-list.component';
import { ApprovedInvoiceListComponent } from './approved-invoice-list/approved-invoice-list.component';
import { RejectInvoiceListComponent } from './reject-invoice-list/reject-invoice-list.component';
import { InvoiceRequestListComponent } from './invoice-request-list/invoice-request-list.component';

const routes: Routes = [
  { path: '', component: InvoiceRequestComponent,
children:[
  {path:'',redirectTo:'invoice-request-list',pathMatch:'full'},
  {path:'invoice-request-list',component:InvoiceRequestListComponent},
  {path:'approved-invoice-list',component:ApprovedInvoiceListComponent},

  {path:'reject-invoice-list',component:RejectInvoiceListComponent},
]
},
  { path: 'raise-invoice', component: RaiseInvoiceComponent },
  { path: 'manual-invoice', component: ManualInvoiceComponent },
  {path:'invoice-request-create',component:InvoiceRequestCreateComponent},
  {
    path:'make-manual-invoice',
    loadChildren:()=>import('../make-manual-invoice/make-manual-invoice.module').then(m=>m.MakeManualInvoiceModule)
  },

];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRequestRoutingModule { }
