import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedInvoiceComponent } from './shared-invoice.component';

const routes: Routes = [{ path: '', component: SharedInvoiceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedInvoiceRoutingModule { }
