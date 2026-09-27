import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseInvoicePayableComponent } from './expense-invoice-payable/expense-invoice-payable.component';
import { VendorInvoicePayableComponent } from './vendor-invoice-payable/vendor-invoice-payable.component';
import { AuditorInvoicePayableComponent } from './auditor-invoice-payable/auditor-invoice-payable.component';
import { AllPayableComponent } from './all-payable.component';
import { CpInvoicePaybleListComponent } from './cp-invoice-list/cp-invoice-list.component';
import { ExpenseInvoicePdfComponent } from './expense-invoice-pdf/expense-invoice-pdf.component';
import { VendorInvoicePdfComponent } from './vendor-invoice-pdf/vendor-invoice-pdf.component';
import { AuditorInvoicePdfComponent } from './auditor-invoice-pdf/auditor-invoice-pdf.component';
import { CpInvoicePdfComponent } from './cp-invoice-pdf/cp-invoice-pdf.component';
// import { CpInvoiceListComponent } from '../all-recived-invoice/cp-invoice-list/cp-invoice-list.component';
// import { ExpenseInvoiceCreateComponent } from './expense-invoice-create/expense-invoice-create.component';
// import { VendorInvoiceCreateComponent } from './vendor-invoice-create/vendor-invoice-create.component';
// import { AuditorInvoiceCreateComponent } from './auditor-invoice-create/auditor-invoice-create.component';

const routes: Routes = [
  {path:'',component:AllPayableComponent,
children:[
  {path:'',redirectTo:'expense-invoice-payble',pathMatch:'full'},
  {path:'expense-invoice-payble',component:ExpenseInvoicePayableComponent},
  {path:'vendor-invoice-payble',component:VendorInvoicePayableComponent},
  {path:'auditor-invoice-payble',component:AuditorInvoicePayableComponent},
  {path:'cp-invoice-payble',component:CpInvoicePaybleListComponent},

  // {path:'expense-invoice-create',component:ExpenseInvoiceCreateComponent},
  // {path:'vendor-invoice-create',component:VendorInvoiceCreateComponent},
  // {path:'auditor-invoice-create',component:AuditorInvoiceCreateComponent},
]
},
  {path:'expense-invoice-pdf',component:ExpenseInvoicePdfComponent},
  {path:'vendor-invoice-pdf',component:VendorInvoicePdfComponent},
  {path:'auditor-invoice-pdf',component:AuditorInvoicePdfComponent},
  {path:'cp-invoice-pdf',component:CpInvoicePdfComponent},

  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllPayableRoutingModule { }
