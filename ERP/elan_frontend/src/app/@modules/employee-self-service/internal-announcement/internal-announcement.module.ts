import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternalAnnouncementRoutingModule } from './internal-announcement-routing.module';
import { AnnouncementListComponent } from './announcement-list/announcement-list.component';
import { AnnouncementCreateComponent } from './announcement-create/announcement-create.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionComponent } from './announcement-list/action/action.component';
import { AnnouncementViewComponent } from './announcement-view/announcement-view.component';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [
    AnnouncementListComponent,
    AnnouncementCreateComponent,
    ActionComponent,
    AnnouncementViewComponent
  ],
  imports: [
    CommonModule,
    InternalAnnouncementRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CKEditorModule
  ]
})
export class InternalAnnouncementModule { }
