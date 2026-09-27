import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrmsRoutingModule } from './hrms-routing.module';
import { HrmsComponent } from './hrms.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HrmsComponent],
  imports: [
    CommonModule,
    HrmsRoutingModule,
    MaterialModule,
    AgGridModule,
    ShairedModule,
    FormsModule,
  ]
})
export class HrmsModule {}

