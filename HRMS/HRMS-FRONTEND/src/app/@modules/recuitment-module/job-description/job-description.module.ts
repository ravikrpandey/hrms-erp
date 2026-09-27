import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { JobDescriptionRoutingModule } from './job-description-routing.module';
import { JobDescriptionComponent } from './job-description.component';
import { JobDescriptionListComponent } from './job-description-list/job-description-list.component';
import { JobDescriptionCreateComponent } from '../job-description-main/job-description-create/job-description-create.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { ActionTwoComponent } from './action/action.component';
import { JobListDialogComponent } from './emp-list-dialog/emp-list-dialog.component';
import { CKEditorModule } from 'ckeditor4-angular';
import {MatStepperModule} from '@angular/material/stepper';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ListJobDiscriptionComponent } from './list-job-discription/list-job-discription.component';
import { CreateJobDiscriptionComponent } from './create-job-discription/create-job-discription.component';

@NgModule({
  declarations: [
    JobDescriptionComponent,
    JobDescriptionListComponent,
  
    ActionTwoComponent,
    JobListDialogComponent,
    ListJobDiscriptionComponent,
    CreateJobDiscriptionComponent
  ],
  imports: [
    CommonModule,
    JobDescriptionRoutingModule,
    AgGridModule,
    HttpClientModule,
     FormsModule,
     MatFormFieldModule,
     MatInputModule,
     MatCardModule,
     MaterialModule,
     ReactiveFormsModule,
     MatDialogModule,
     CKEditorModule,
     MatStepperModule,
     MatSelectFilterModule
  ]
})
export class JobDescriptionModule { }
