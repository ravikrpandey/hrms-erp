import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreStockAcknowledgeComponent } from './store-stock-acknowledge.component';

const routes: Routes = [
  { path: '',component: StoreStockAcknowledgeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreStockAcknowledgeRoutingModule { }
