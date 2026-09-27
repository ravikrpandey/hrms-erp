import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruitmentReportRoutingModule } from './recruitment-report-routing.module';
import { RecruitmentReportComponent } from './recruitment-report.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    RecruitmentReportComponent
  ],
  imports: [
    CommonModule,
    RecruitmentReportRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class RecruitmentReportModule { }
