import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearningGalleryRoutingModule } from './learning-gallery-routing.module';
import { CommonCourseActionComponent } from './common-course/common-course-action/common-course-action.component';
import { CommonCourseDialogComponent } from './common-course/common-course-dialog/common-course-dialog.component';
import { LearningGalleryComponent } from './learning-gallery.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
       CommonCourseActionComponent,
       LearningGalleryComponent,
       CommonCourseDialogComponent
  ],
  imports: [
    CommonModule,
    LearningGalleryRoutingModule,
    MatIconModule,
    CommonModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatSelectFilterModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatTooltipModule
  ]
})
export class LearningGalleryModule { }
