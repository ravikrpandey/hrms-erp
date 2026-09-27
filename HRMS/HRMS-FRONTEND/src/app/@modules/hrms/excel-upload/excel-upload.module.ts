import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExcelUploadRoutingModule } from './excel-upload-routing.module';
import { ExcelUploadComponent } from './excel-upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    ExcelUploadComponent
  ],
  imports: [
    CommonModule,
    ExcelUploadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
    providers: [
      PayrollService,
    ]
})
export class ExcelUploadModule { }
