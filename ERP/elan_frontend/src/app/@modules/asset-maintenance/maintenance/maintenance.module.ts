import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceListComponent } from './maintenance-list/maintenance-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { AddMaintenanceComponent } from './add-maintenance/add-maintenance.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionMaintenanceComponent } from './action-maintenance/action-maintenance.component';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    MaintenanceListComponent,
    AddMaintenanceComponent,
    ActionMaintenanceComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectFilterModule 
  ]
})
export class MaintenanceModule { }
