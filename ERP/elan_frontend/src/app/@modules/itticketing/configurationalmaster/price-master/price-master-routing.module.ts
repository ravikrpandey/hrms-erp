import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PriceMasterComponent } from './price-master.component';
import { PriceCreateComponent } from './price-create/price-create.component';

const routes: Routes = [
  { path: "", component: PriceMasterComponent},
  { path: "create", component: PriceCreateComponent}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceMasterRoutingModule { }
