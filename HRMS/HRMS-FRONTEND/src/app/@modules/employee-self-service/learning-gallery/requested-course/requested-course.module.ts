import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestedCourseRoutingModule } from './requested-course-routing.module';
import { RequestedCourseComponent } from './requested-course.component';
import { DialogRequestedCourseComponent } from './dialog-requested-course/dialog-requested-course.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';


@NgModule({
  declarations: [
    RequestedCourseComponent,
    DialogRequestedCourseComponent
  ],
  imports: [
    CommonModule,
    RequestedCourseRoutingModule,
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
        MatTooltipModule,
        SearchFilterComponent
  ]
})
export class RequestedCourseModule { }
