import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrmsComplaintRoutingModule } from './hrms-complaint-routing.module';
import { HrmsComplaintComponent } from './hrms-complaint.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ActionComponent } from './action/action.component';


@NgModule({
  declarations: [
    HrmsComplaintComponent,
    ActionComponent
  ],
  imports: [
    CommonModule,
    HrmsComplaintRoutingModule,
    AgGridModule,
    MaterialModule
  ]
})
export class HrmsComplaintModule { }
