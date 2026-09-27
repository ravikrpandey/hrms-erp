import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceManagementRoutingModule } from './performance-management-routing.module';
import { PerformanceManagementComponent } from './performance-management.component';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateSelfAssessmentComponent } from './self-assessment/create-self-assessment/create-self-assessment.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS, CustomDateAdapter } from 'src/app/@shared/adapter/custom-date-adapter';

@NgModule({
  declarations: [
    PerformanceManagementComponent,
  ],
  imports: [
    CommonModule,
    PerformanceManagementRoutingModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
})
export class PerformanceManagementModule { }
