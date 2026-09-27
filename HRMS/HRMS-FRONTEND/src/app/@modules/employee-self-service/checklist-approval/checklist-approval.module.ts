import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSelectFilterModule } from 'mat-select-filter';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FullCalendarModule } from '@fullcalendar/angular';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { NgImageSliderModule } from 'ng-image-slider';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';

import { ChecklistApprovalRoutingModule } from './checklist-approval-routing.module';
import { ChecklistApprovalComponent } from './checklist-approval.component';
import { ChecklistApprovalListComponent } from './checklist-approval-list/checklist-approval-list/checklist-approval-list.component';
import { ChecklistApprovalActionComponent } from './checklist-approval-list/checklist-approval-action/checklist-approval-action.component';
import { ChecklistApprovalCreateComponent } from './checklist-approval-list/checklist-approval-create/checklist-approval-create.component';
import { ChecklistApprovedComponent } from './checklist-approval-list/checklist-approved/checklist-approved.component';


@NgModule({
  declarations: [
    ChecklistApprovalComponent,
    ChecklistApprovalListComponent,
    ChecklistApprovalActionComponent,
    ChecklistApprovalCreateComponent,
    ChecklistApprovedComponent

  ],
  imports: [
    CommonModule,
    ChecklistApprovalRoutingModule,
    AgGridModule,
    MaterialModule,
    CKEditorModule,
    MatSelectFilterModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,    
    MatFormFieldModule,    
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    FullCalendarModule,
    NgImageSliderModule,
    IvyCarouselModule,
    MatExpansionModule, 
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule,
    ShairedModule,
    MatSelectFilterModule,
  ]
})
export class ChecklistApprovalModule { }
