import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceCheckMasterRoutingModule } from './maintenance-check-master-routing.module';
import { MaintenanceCheckListComponent } from './maintenance-check-list/maintenance-check-list.component';
import { MaintenanceCheckCreateComponent } from './maintenance-check-create/maintenance-check-create.component';
import { MaintenanceCheckStatusComponent } from './maintenance-check-status/maintenance-check-status.component';
import { MaintenanceCheckActionComponent } from './maintenance-check-action/maintenance-check-action.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    MaintenanceCheckListComponent,
    MaintenanceCheckCreateComponent,
    MaintenanceCheckStatusComponent,
    MaintenanceCheckActionComponent
  ],
  imports: [
    CommonModule,
    MaintenanceCheckMasterRoutingModule,
       AgGridModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
  ]
})
export class MaintenanceCheckMasterModule { }
