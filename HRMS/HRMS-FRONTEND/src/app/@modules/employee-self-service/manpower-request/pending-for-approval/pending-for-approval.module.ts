import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { PendingForApprovalRoutingModule } from './pending-for-approval-routing.module';
import { PendingListComponent } from './pending-list/pending-list.component';
import { ListFormComponent } from './list-form/list-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CKEditorModule } from 'ckeditor4-angular';


@NgModule({
  declarations: [
    PendingListComponent,
    ListFormComponent
  ],
  imports: [
    CommonModule,
    PendingForApprovalRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CKEditorModule
  ]
})
export class PendingForApprovalModule { }
