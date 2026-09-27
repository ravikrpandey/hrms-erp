import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessAllowanceRoutingModule } from './process-allowance-routing.module';
import { ProcessAllowanceComponent } from './process-allowance/process-allowance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ProcessAllowanceComponent
  ],
  imports: [
    CommonModule,
    ProcessAllowanceRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    MatSelectFilterModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class ProcessAllowanceModule { }
