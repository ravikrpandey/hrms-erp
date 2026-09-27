import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ArearSalaryRoutingModule } from './arear-salary-routing-module';
import { ArearSalaryList } from './arear-salary-list/arear-salary-list';
import { ArearSalaryCreate } from './arear-salary-create/arear-salary-create';
import { ArearSalaryAction } from './arear-salary-action/arear-salary-action';


@NgModule({
  declarations: [
    ArearSalaryList,
    ArearSalaryCreate,
    ArearSalaryAction
  ],
  imports: [
    CommonModule,
    ArearSalaryRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule
  ]
})
export class ArearSalaryModule { }
