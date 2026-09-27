import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleMaintenanceRoutingModule } from './schedule-maintenance-routing.module';
import { ScheduleMaintenanceComponent } from '../schedule-maintenance/schedule-maintenance.component';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { VendorScheduleMaintenanceComponent } from './vendor-schedule-maintenance/vendor-schedule-maintenance.component';
import { ScheduleActionComponent } from './schedule-action/schedule-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    ScheduleMaintenanceComponent,
    VendorScheduleMaintenanceComponent,
    ScheduleActionComponent
  ],
  imports: [
    CommonModule,
    ScheduleMaintenanceRoutingModule,
    FormsModule,
    AgGridModule,
    MaterialModule
  ]
})
export class ScheduleMaintenanceModule { }
