import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobDescriptionMainRoutingModule } from './job-description-main-routing.module';
import { JobDiscriptionListComponent } from './job-discription-list/job-discription-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { JobActionComponent } from './job-action/job-action.component';
import { JobDescriptionCreateComponent } from './job-description-create/job-description-create.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectFilterModule } from 'mat-select-filter';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    JobDiscriptionListComponent,
    JobActionComponent,
    JobDescriptionCreateComponent,
  ],
  imports: [
    CommonModule,
    JobDescriptionMainRoutingModule,
    AgGridModule,
    MaterialModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatSelectFilterModule,
    SearchFilterComponent
  ]
})
export class JobDescriptionMainModule { }
