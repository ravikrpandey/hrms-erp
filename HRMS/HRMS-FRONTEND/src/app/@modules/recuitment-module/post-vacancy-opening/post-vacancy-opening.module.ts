import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostVacancyOpeningRoutingModule } from './post-vacancy-opening-routing.module';
import { PostOpeningListComponent } from './post-opening-list/post-opening-list.component';
import { PostOpeningCreateComponent } from './post-opening-create/post-opening-create.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatIconModule } from '@angular/material/icon';
import { ActionPostComponent } from './post-opening-list/action-post/action-post.component';
import { MatSelectFilterModule } from 'mat-select-filter';



@NgModule({
  declarations: [
    PostOpeningListComponent,
    PostOpeningCreateComponent,
    ActionPostComponent
  ],
  imports: [
    CommonModule,
    PostVacancyOpeningRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    CKEditorModule,
    MatIconModule,
    MatSelectFilterModule
  ]
})
export class PostVacancyOpeningModule { }
