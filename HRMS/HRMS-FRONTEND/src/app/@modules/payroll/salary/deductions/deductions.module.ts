import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeductionsRoutingModule } from './deductions-routing.module';
import { DeductionCreateComponent } from './deduction-create/deduction-create.component';
import { DeductionListComponent } from './deduction-list/deduction-list.component';
import { DeductionActionComponent } from './deduction-action/deduction-action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    DeductionCreateComponent,
    DeductionListComponent,
    DeductionActionComponent
  ],
  imports: [
    CommonModule,
    DeductionsRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DeductionsModule { }
