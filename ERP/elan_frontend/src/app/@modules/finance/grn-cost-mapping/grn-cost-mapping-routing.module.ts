import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrnCostMappingListComponent } from './grn-cost-mapping-list/grn-cost-mapping-list.component';

const routes: Routes = [
  {path:'',component:GrnCostMappingListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrnCostMappingRoutingModule { }
