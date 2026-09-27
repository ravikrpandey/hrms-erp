import { MaterialModule } from './../../../@shared/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveRfpRoutingModule } from './live-rfp-routing.module';
import { LiveRfpComponent } from './live-rfp.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RfpActionComponent } from './rfp-action/rfp-action.component';
import { RfpDetailsComponent } from './rfp-details/rfp-details.component';

@NgModule({
  declarations: [
    LiveRfpComponent,
    RfpActionComponent,
    RfpDetailsComponent
  ],
  imports: [
    CommonModule,
    LiveRfpRoutingModule,
     AgGridModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
  ]
})
export class LiveRfpModule { }
