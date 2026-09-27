import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplaintMasterRoutingModule } from './complaint-master-routing.module';
import { ComplaintMasterComponent } from './complaint-master.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateComplaintDialogComponent } from './create-complaint-dialog/create-complaint-dialog.component';
import { ComplaintActionComponent } from './complaint-action/complaint-action.component';
import { ComplaintStatusComponent } from './complaint-status/complaint-status.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    ComplaintMasterComponent,
    CreateComplaintDialogComponent,
    ComplaintActionComponent,
    ComplaintStatusComponent
  ],
  imports: [
    CommonModule,
    ComplaintMasterRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ComplaintMasterModule { }
