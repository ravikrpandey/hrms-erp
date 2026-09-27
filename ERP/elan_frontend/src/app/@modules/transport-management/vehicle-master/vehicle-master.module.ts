import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleMasterRoutingModule } from './vehicle-master-routing.module';
import { VehicleMasterComponent } from './vehicle-master.component';
import { CreateVehicleMasterComponent } from './create-vehicle-master/create-vehicle-master.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MatInputModule } from '@angular/material/input';
import { VehicleActionComponent } from './vehicle-action/vehicle-action.component';


@NgModule({
  declarations: [
    VehicleMasterComponent,
    CreateVehicleMasterComponent,
    VehicleActionComponent
  ],
  imports: [
    CommonModule,
    VehicleMasterRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    AgGridModule,
    MatInputModule
  ]
})
export class VehicleMasterModule { }
