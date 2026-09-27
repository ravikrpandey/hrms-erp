import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseRequestComponent } from './purchase-request.component';
import { CreatePurchaseRequestComponent } from './create-purchase-request/create-purchase-request.component';

const routes: Routes = [
  {
    path: '', component: PurchaseRequestComponent,
  },
  { path: 'create-pr', component: CreatePurchaseRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRequestRoutingModule { }
