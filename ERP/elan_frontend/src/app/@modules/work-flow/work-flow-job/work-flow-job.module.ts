import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkFlowJobRoutingModule } from './work-flow-job-routing.module';
import { WorkFlowJobListComponent } from './work-flow-job-list/work-flow-job-list.component';
import { WorkFlowJobCreateComponent } from './work-flow-job-create/work-flow-job-create.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ActionJobComponent } from './action-job/action-job.component';
import { WorkFlowListPopComponent } from './work-flow-list-pop/work-flow-list-pop.component';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    WorkFlowJobListComponent,
    WorkFlowJobCreateComponent,
    ActionJobComponent,
    WorkFlowListPopComponent
  ],
  imports: [
    CommonModule,
    WorkFlowJobRoutingModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
    MatSelectFilterModule
  ]
})
export class WorkFlowJobModule { }
