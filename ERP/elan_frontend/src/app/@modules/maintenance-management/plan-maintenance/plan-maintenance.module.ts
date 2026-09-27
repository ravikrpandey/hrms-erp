import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanMaintenanceRoutingModule } from './plan-maintenance-routing.module';
import { PlanMaintenanceComponent } from './plan-maintenance.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CreateScheduleMaintenanceComponent } from './create-schedule-maintenance/create-schedule-maintenance.component';
import { RemarkDialogueComponent } from './remark-dialogue/remark-dialogue.component';
import { MaintenaceCheckComponent } from './maintenace-check/maintenace-check.component';


@NgModule({
  declarations: [
    PlanMaintenanceComponent,
    CreateScheduleMaintenanceComponent,
    RemarkDialogueComponent,
    MaintenaceCheckComponent
  ],
  imports: [
    CommonModule,
    PlanMaintenanceRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class PlanMaintenanceModule { }
