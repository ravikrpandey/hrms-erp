import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order.component';
import { CreatePoFormComponent } from './create-po-form/create-po-form.component';

const routes: Routes = [
  { path: '', component: PurchaseOrderComponent },
  { path: 'create-po', component: CreatePoFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
