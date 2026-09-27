import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyRequestManpowerRoutingModule } from './my-request-manpower-routing.module';
import { MyRequestListComponent } from './my-request-list/my-request-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MyRequestCreateComponent } from './my-request-create/my-request-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { RequestActionComponent } from './request-action/request-action.component';
import { ApprovalComponent } from '../approval/approval.component';
import { MyRequestDialogComponent } from './my-request-dialog/my-request-dialog.component';
import { RemarkJobRequestComponent } from './remark-job-request/remark-job-request.component';
import { SearchFilterComponent } from "src/app/@shared/components/search-filter/search-filter.component";

@NgModule({
  declarations: [
    MyRequestListComponent,
    MyRequestCreateComponent,
    RequestActionComponent,
    ApprovalComponent,
    MyRequestDialogComponent,
    RemarkJobRequestComponent,
  
  ],
  imports: [
    CommonModule,
    MyRequestManpowerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    MaterialModule,
    CKEditorModule,
    SearchFilterComponent
]
})
export class MyRequestManpowerModule { }
