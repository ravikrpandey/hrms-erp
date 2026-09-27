import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateIncentive } from './create-incentive/create-incentive';
import { IncentiveList } from './incentive-list/incentive-list';

const routes: Routes = [
  {path: "create-incentive", component: CreateIncentive},
  {path: "allocate-incentive", component: IncentiveList}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncentiveRoutingModule { }
