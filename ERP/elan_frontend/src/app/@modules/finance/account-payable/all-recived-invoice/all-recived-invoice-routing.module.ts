import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllRecivedInvoiceComponent } from './all-recived-invoice.component';
import { ExpenseInvoiceComponent } from './expense-invoice/expense-invoice.component';
import { VendorInvoiceListComponent } from './vendor-invoice-list/vendor-invoice-list.component';
import { AuditorInvoiceListComponent } from './auditor-invoice-list/auditor-invoice-list.component';
import { ExpenseInvoiceCreateComponent } from './expense-invoice-create/expense-invoice-create.component';
import { AuditorInvoiceCreateComponent } from './auditor-invoice-create/auditor-invoice-create.component';
import { VendorInvoiceCreateComponent } from './vendor-invoice-create/vendor-invoice-create.component';
import { CpInvoiceListComponent } from './cp-invoice-list/cp-invoice-list.component';
import { CpInvoiceCreateComponent } from './cp-invoice-create/cp-invoice-create.component';

const routes: Routes = [
  {path:'',component:AllRecivedInvoiceComponent,
   children:[
    {path:'',redirectTo:'expense-invoice',pathMatch:'full'},
  { path:'expense-invoice',component:ExpenseInvoiceComponent},
  {path:'vendor-invoice-list',component:VendorInvoiceListComponent},
  {path:'auditor-invoice-list',component:AuditorInvoiceListComponent},
  {path:'cp-invoice-list',component:CpInvoiceListComponent},

]
},
{path:'expense-invoice-create',component:ExpenseInvoiceCreateComponent},
  {path:'vendor-invoice-create',component:VendorInvoiceCreateComponent},
  {path:'auditor-invoice-create',component:AuditorInvoiceCreateComponent},
  {path:'cp-invoice-create',component:CpInvoiceCreateComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllRecivedInvoiceRoutingModule { }
