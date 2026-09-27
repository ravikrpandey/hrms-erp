import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSelectFilterModule } from 'mat-select-filter';


import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { FullCalendarModule } from '@fullcalendar/angular';
import { NgImageSliderModule } from 'ng-image-slider';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';

import { ChecklistApprovalListRoutingModule } from './checklist-approval-list-routing.module';
import { ChecklistApprovalListComponent } from './checklist-approval-list/checklist-approval-list.component';
import { ChecklistApprovalActionComponent } from './checklist-approval-action/checklist-approval-action.component';
import { ChecklistApprovalCreateComponent } from './checklist-approval-create/checklist-approval-create.component';
import { ChecklistApprovedComponent } from './checklist-approved/checklist-approved.component';



@NgModule({
  declarations: [
    // ChecklistApprovalListComponent,
    ChecklistApprovalActionComponent,
    // ChecklistApprovalCreateComponent,
    // ChecklistApprovedComponent
  ],
  imports: [
    CommonModule,
    ChecklistApprovalListRoutingModule,
    FormsModule,
    AgGridModule,
    MaterialModule,
    CKEditorModule,
    ReactiveFormsModule,    
    MatFormFieldModule,    
    MatInputModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCardModule,
    FullCalendarModule,
    NgImageSliderModule,
    IvyCarouselModule,
    MatExpansionModule, 
    MatSelectFilterModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule,
    ShairedModule,
    
  ]
})
export class ChecklistApprovalListModule { }
