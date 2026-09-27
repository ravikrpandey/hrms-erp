import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { CKEditorModule } from 'ckeditor4-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ActionsComponent } from './actions/actions.component';
import { UploadTicketsModuleRoutingModule } from './upload-tickets-routing.module';
import { UploadTicketsModuleListComponent } from './upload-tickets-list.component';




@NgModule({
  declarations: [
    ActionsComponent,
    UploadTicketsModuleListComponent,
  ],
  imports: [
    CommonModule,
    UploadTicketsModuleRoutingModule,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    FormsModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    CKEditorModule
  ]
})
export class UploadTicketsModule { }
