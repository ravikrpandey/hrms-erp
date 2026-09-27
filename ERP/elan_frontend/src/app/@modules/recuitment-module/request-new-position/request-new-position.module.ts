import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { RequestNewPositionRoutingModule } from './request-new-position-routing.module';
import { RequestNewPositionComponent } from './request-new-position.component';
import { RequestNewPositionCreateComponent } from './request-new-position-create/request-new-position-create.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { CKEditorModule } from 'ckeditor4-angular';
import {MatStepperModule} from '@angular/material/stepper';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [
    RequestNewPositionComponent,
    RequestNewPositionCreateComponent,
  ],
  imports: [
    CommonModule,
    RequestNewPositionRoutingModule,
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
export class RequestNewPositionModule { }
