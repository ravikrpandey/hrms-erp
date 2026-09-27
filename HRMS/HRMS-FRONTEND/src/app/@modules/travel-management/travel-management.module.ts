import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { CKEditorModule } from 'ckeditor4-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ComplaintModule } from '../employee-self-service/complaint/complaint.module';
import { TimesheetModule } from '../employee-self-service/timesheet/timesheet.module';
import { TravelManagementComponent } from './travel-management.component';
import { TravelManagementRoutingModule } from './travel-management-routing.module';



@NgModule({
  declarations: [
    TravelManagementComponent
  ],
  imports: [
    CommonModule,
    TravelManagementRoutingModule,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    ComplaintModule,
    TimesheetModule,
    FormsModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    CKEditorModule
  ]
})
export class TravelManagementModule { }
