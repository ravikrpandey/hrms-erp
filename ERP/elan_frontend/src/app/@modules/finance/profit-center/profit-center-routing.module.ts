import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfitCenterComponent } from './profit-center.component';
import { AddProfitCenterComponent } from './add-profit-center/add-profit-center.component';

const routes: Routes = [
  {
    path:'',component:ProfitCenterComponent
  },
  {
    path:'add-profit-center',component:AddProfitCenterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfitCenterRoutingModule { }
