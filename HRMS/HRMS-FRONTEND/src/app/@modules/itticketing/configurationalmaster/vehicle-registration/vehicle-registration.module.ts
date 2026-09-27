import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductMasterRoutingModule } from './vehicle-registration-routing.module';
import { VehicleRegistrationListComponent } from './vehicle-registration-list/vehicle-registration-list.component';
import { VehicleRegistrationCreateComponent } from './vehicle-registration-create/vehicle-registration-create.component';
import { VehicleRegistrationActionComponent } from './vehicle-registration-action/vehicle-registration-action.component';
import { VehicleRegistrationStatusComponent } from './vehicle-registration-action/vehicle-registration-status/vehicle-registration-status.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    VehicleRegistrationListComponent,
    VehicleRegistrationCreateComponent,
    VehicleRegistrationActionComponent,
    VehicleRegistrationActionComponent,
    VehicleRegistrationStatusComponent
  ],
  imports: [
    CommonModule,
    ProductMasterRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule,

  ]
})
export class VehicleRegistrationModule { }
