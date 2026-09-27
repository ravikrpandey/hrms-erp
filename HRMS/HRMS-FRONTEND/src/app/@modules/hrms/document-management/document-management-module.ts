import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentManagementRoutingModule } from './document-management-routing-module';
import { DocumentManagement } from './document-management-list/document-management';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTemplate } from './add-template/add-template';
import { AgGridModule } from "ag-grid-angular";
import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { DocumentComponent } from './document-action/document-action.component';
import { SendDownloadDocument } from './send-download-document/send-download-document';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';

@NgModule({
  declarations: [
    DocumentManagement,
    AddTemplate,
    DocumentComponent,
    SendDownloadDocument
  ],
  imports: [
    CommonModule,
    DocumentManagementRoutingModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    // NgSelectModule,
     MatSelectModule,
    MatFormFieldModule,
    MatOptionModule

    
]
})
export class DocumentManagementModule { }
