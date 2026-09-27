import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YearlyAssessmentRoutingModule } from './yearly-assessment-routing.module';
import { ListAssessmentComponent } from './list-assessment/list-assessment.component';
import { CreateAssessmentComponent } from './create-assessment/create-assessment.component';
import { ActionAssessmentComponent } from './action-assessment/action-assessment.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { HrmsModule } from '../../hrms/hrms.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CUSTOM_DATE_FORMATS, CustomDateAdapter } from 'src/app/@shared/adapter/custom-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSelectFilterModule } from 'mat-select-filter';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    ListAssessmentComponent,
    CreateAssessmentComponent,
    ActionAssessmentComponent
  ],
  imports: [
    CommonModule,
    YearlyAssessmentRoutingModule,
    MaterialModule,
    HrmsModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    MatSelectFilterModule,
    MatSelectModule,
    SearchFilterComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
})
export class YearlyAssessmentModule { }
