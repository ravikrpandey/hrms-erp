import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkFlowPrpoComponent } from './work-flow-prpo.component';
import { AddWorkFlowPrpoComponent } from './add-work-flow-prpo/add-work-flow-prpo.component';

const routes: Routes = [
  {
    path:'',component:WorkFlowPrpoComponent
  },
  {
    path:'add-work-flow',component:AddWorkFlowPrpoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkFlowPrpoRoutingModule { }
