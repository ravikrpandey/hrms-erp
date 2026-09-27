import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkFlowJobListComponent } from './work-flow-job-list/work-flow-job-list.component';
import { WorkFlowJobCreateComponent } from './work-flow-job-create/work-flow-job-create.component';

const routes: Routes = [
  {path:'',component:WorkFlowJobListComponent},
  {path:'work-flow-create',component:WorkFlowJobCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkFlowJobRoutingModule { }
