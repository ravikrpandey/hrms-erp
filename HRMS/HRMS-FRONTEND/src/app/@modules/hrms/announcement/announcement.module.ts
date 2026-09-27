import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnouncementRoutingModule } from './announcement-routing.module';
import { AnnouncementComponent } from './announcement.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateAnnouncementComponent } from './create-announcement/create-announcement.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ActionAnnouncementComponent } from './action-announcement/action-announcement.component';
import { AnnoncementImageModelComponent } from './annoncement-image-model/annoncement-image-model.component';


@NgModule({
  declarations: [
    AnnouncementComponent,
    CreateAnnouncementComponent,
    ActionAnnouncementComponent,
    AnnoncementImageModelComponent
  ],
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule,
    CKEditorModule
  ]
})
export class AnnouncementModule { }
