import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkFlowRfpComponent } from './work-flow-rfp.component';
import { AddWorkFlowRfpComponent } from './add-work-flow-rfp/add-work-flow-rfp.component';

const routes: Routes = [
  {
    path:'',component:WorkFlowRfpComponent
  },
  {
    path:'add-work-flow',component:AddWorkFlowRfpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkFlowRfpRoutingModule { }
