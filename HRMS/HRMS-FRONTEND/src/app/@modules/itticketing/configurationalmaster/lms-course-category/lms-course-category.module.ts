import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LmsCourseCategoryRoutingModule } from './lms-course-category-routing.module';
import { LmsCourseCategoryComponent } from './lms-course-category.component';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { LmsCategoryActionComponent } from './lms-category-action/lms-category-action.component';
import { LmsCategoryDialogComponent } from './lms-category-dialog/lms-category-dialog.component';

@NgModule({
  declarations: [
    LmsCourseCategoryComponent,
    LmsCategoryActionComponent,
    LmsCategoryDialogComponent
  ],
  imports: [
    CommonModule,
    LmsCourseCategoryRoutingModule,
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
    MatIconModule,
    MatTooltipModule
  ]
})
export class LmsCourseCategoryModule { }
