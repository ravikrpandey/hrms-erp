import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppraisalDurationRoutingModule } from './appraisal-duration-routing.module';
import { DurationListComponent } from './duration-list/duration-list.component';
import { DurationCreateComponent } from './duration-create/duration-create.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DurationToggleComponent } from './duration-toggle/duration-toggle.component';
import { ActionDurationComponent } from './action-duration/action-duration.component';


@NgModule({
  declarations: [
    DurationListComponent,
    DurationCreateComponent,
    DurationToggleComponent,
    ActionDurationComponent
  ],
  imports: [
    CommonModule,
    AppraisalDurationRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    
  ]
})
export class AppraisalDurationModule { }
