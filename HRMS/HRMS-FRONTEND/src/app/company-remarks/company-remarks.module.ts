import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '../@shared/material/material.module';
import { CompanyRemarksComponent } from './company-remarks.component';
import { CompanyRemarksRoutingModule } from './company-remarks-routing.module';


@NgModule({
  declarations: [
    CompanyRemarksComponent
  ],
  imports: [
    CommonModule,
    CompanyRemarksRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CompanyRemarksModule { }
