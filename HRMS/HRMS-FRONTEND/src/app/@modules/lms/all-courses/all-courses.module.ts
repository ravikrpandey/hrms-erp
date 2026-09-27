import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCoursesComponent } from './all-courses.component';
import { AddCoursesComponent } from './add-courses/add-courses.component';
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
import { AllCoursesRoutingModule } from './all-courses-routing.module';
import { AddAssesmentComponent } from './add-assesment/add-assesment.component';
import { AddContentComponent } from './add-content/add-content.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';


@NgModule({
  declarations: [
    AllCoursesComponent,
    AddCoursesComponent,
    AddAssesmentComponent,
    AddContentComponent,
    AddQuestionComponent

  ],
  imports: [
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
    MatIconModule,
    MatTooltipModule,
    AllCoursesRoutingModule,
    SearchFilterComponent
  ],
  bootstrap: [AllCoursesComponent]
})
export class AllCoursesModule { }
