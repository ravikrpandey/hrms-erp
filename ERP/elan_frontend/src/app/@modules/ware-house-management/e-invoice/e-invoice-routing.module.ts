import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EInvoiceListComponent } from './e-invoice-list/e-invoice-list.component';

const routes: Routes = [{ path: '', component: EInvoiceListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EInvoiceRoutingModule { }
