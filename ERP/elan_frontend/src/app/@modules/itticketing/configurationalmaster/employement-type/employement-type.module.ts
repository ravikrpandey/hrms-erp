import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';

import { EmployementTypeRoutingModule } from './employement-type-routing.module';
import { EmployementTypeComponent } from './employement-type.component';
import { EmptActionComponent } from './empt-action/empt-action.component';
import { EmptDialogComponent } from './empt-dialog/empt-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmploymentStatusComponent } from './employment-status/employment-status.component';


@NgModule({
  declarations: [
    EmployementTypeComponent,
    EmptActionComponent,
    EmptDialogComponent,
    EmploymentStatusComponent
  ],
  imports: [
    CommonModule,
    EmployementTypeRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EmployementTypeModule { }
