import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ManpowerListComponent } from './manpower-list/manpower-list.component';
import { ManpowerActionComponent } from './manpower-action/manpower-action.component';
import { ManpowerRoutingModule } from './manpower-routing.module';


@NgModule({
  declarations: [
    ManpowerListComponent,
    ManpowerActionComponent,
  ],
  imports: [
    CommonModule,
    ManpowerRoutingModule,
    AgGridModule,
    MaterialModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatSelectFilterModule
  ]
})
export class ManpowerModule { }
