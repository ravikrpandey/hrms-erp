import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruimentReportRoutingModule } from './recruiment-report-routing.module';
import { RecruimentReportComponent } from './recruiment-report.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    RecruimentReportComponent
  ],
  imports: [
    CommonModule,
    RecruimentReportRoutingModule,
    AgGridModule,
    FormsModule,
    MaterialModule
  ]
})
export class RecruimentReportModule { }
