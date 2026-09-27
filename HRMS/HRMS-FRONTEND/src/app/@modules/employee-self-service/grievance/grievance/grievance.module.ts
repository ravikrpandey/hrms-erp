import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrievanceRoutingModule } from './grievance-routing.module';
import { GrievanceListComponent } from './grievance-list/grievance-list.component';
import { GrievanceCreateComponent } from './grievance-create/grievance-create.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ActionComponent } from './grievance-list/action/action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GrievanceDialogComponent } from './grievance-dialog/grievance-dialog.component';


@NgModule({
  declarations: [
    GrievanceListComponent,
    GrievanceCreateComponent,
    ActionComponent,
    GrievanceDialogComponent
  ],
  imports: [
    CommonModule,
    GrievanceRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    
    ReactiveFormsModule,
  ]
})
export class GrievanceModule { }
