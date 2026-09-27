import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoInvoiceComponent } from './so-invoice.component';
import { CreateSoInvoiceComponent } from './create-so-invoice/create-so-invoice.component';

const routes: Routes = [
  {path:"",component:SoInvoiceComponent},
  {path:"create-so-invoice",component:CreateSoInvoiceComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoInvoiceRoutingModule { }
