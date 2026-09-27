import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobDescriptionRoutingModule } from './job-description-routing.module';
import { JobDescriptionComponent } from './job-description.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorJobActionComponent } from './vendor-job-action/vendor-job-action.component';
import { ViewJobDescriptionComponent } from './view-job-description/view-job-description.component';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [
    JobDescriptionComponent,
    VendorJobActionComponent,
    ViewJobDescriptionComponent
  ],
  imports: [
    CommonModule,
    JobDescriptionRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule
  ]
})
export class JobDescriptionModule { }
