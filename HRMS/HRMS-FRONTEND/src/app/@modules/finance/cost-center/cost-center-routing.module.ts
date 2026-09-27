import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostCenterComponent } from './cost-center.component';
import { CostCenterCreateComponent } from './cost-center-create/cost-center-create.component';
import { ExtendDateCostComponent } from './extend-date-cost/extend-date-cost.component';

const routes: Routes = [
  { path: "", component: CostCenterComponent},
  { path: "create-cost", component: CostCenterCreateComponent},
  {path:"extend",component:ExtendDateCostComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostCenterRoutingModule { }
