import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkFlowComponent } from './work-flow.component';
import { WorkFlowJobListComponent } from './work-flow-job/work-flow-job-list/work-flow-job-list.component';
import { WorkFlowJobCreateComponent } from './work-flow-job/work-flow-job-create/work-flow-job-create.component';

const routes: Routes = [
  {
    path: '',
    component: WorkFlowJobListComponent,
    children: [
      {
        path: 'workflow-PR',
        loadChildren: () =>
          import('./work-flow-prpo/work-flow-prpo.module').then(
            (m) => m.WorkFlowPrpoModule
          ),
      },
      {
        path: 'workflow-RFP',
        loadChildren: () =>
          import('./work-flow-rfp/work-flow-rfp.module').then(
            (m) => m.WorkFlowRfpModule
          ),
      },
      {
        path: 'work-flow-job',
        loadChildren: () =>
          import('./work-flow-job/work-flow-job.module').then(
            (m) => m.WorkFlowJobModule
          ),
      },
    ],
  },
  { path: 'work-flow-create', component: WorkFlowJobCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkFlowRoutingModule {}
