import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclePlanningRoutingModule } from './vehicle-planning-routing.module';
import { VehiclePlanningComponent } from './vehicle-planning.component';
import { CreateVehiclePlanningComponent } from './create-vehicle-planning/create-vehicle-planning.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { DispatchListActionComponent } from '../dispatch-list/dispatch-list-action/dispatch-list-action.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VehiclePlanActionComponent } from './vehicle-plan-action/vehicle-plan-action.component';
import { RfqDialogComponent } from './rfq-dialog/rfq-dialog.component';
import { VhTransporterRequestLinkComponent } from './vh-transporter-request-link/vh-transporter-request-link.component';

import { VhTransporterResponseComponent } from './vh-transporter-response/vh-transporter-response.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [VehiclePlanningComponent, CreateVehiclePlanningComponent, VehiclePlanActionComponent, RfqDialogComponent, VhTransporterRequestLinkComponent, VhTransporterResponseComponent],
  imports: [
    CommonModule,
    VehiclePlanningRoutingModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
    MatIconModule
  ],
})
export class VehiclePlanningModule {
}
