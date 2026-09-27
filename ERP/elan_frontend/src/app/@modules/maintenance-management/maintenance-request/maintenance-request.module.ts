import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRequestRoutingModule } from './maintenance-request-routing.module';
import { MaintenanceRequestComponent } from './maintenance-request.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { RequestActionComponent } from './request-action/request-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ApproveMaintenanceComponent } from './approve-maintenance/approve-maintenance.component';
import { RejectMaintenanceComponent } from './reject-maintenance/reject-maintenance.component';
import { ActionComponent } from './approve-maintenance/action/action.component';


@NgModule({
  declarations: [
    MaintenanceRequestComponent,
    RequestActionComponent,
    ApproveMaintenanceComponent,
    RejectMaintenanceComponent,
    ActionComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRequestRoutingModule,
    AgGridModule,
    FormsModule,
    MaterialModule
  ]
})
export class MaintenanceRequestModule { }
