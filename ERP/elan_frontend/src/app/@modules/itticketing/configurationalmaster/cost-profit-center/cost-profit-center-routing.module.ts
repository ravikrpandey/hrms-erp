import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostProfitCenterListComponent } from './cost-profit-center-list/cost-profit-center-list.component';

const routes: Routes = [
  {path:'',component:CostProfitCenterListComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostProfitCenterRoutingModule { 

}
