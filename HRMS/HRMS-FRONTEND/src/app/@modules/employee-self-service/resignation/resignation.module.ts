import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSelectFilterModule } from 'mat-select-filter';

import { ResignationRoutingModule } from './resignation-routing.module';
import { ApplyResignationComponent } from './apply-resignation/apply-resignation.component';
import { ApprovedByMeComponent } from './approved-by-me/approved-by-me.component';
import { RejectComponent } from './reject/reject.component';
import { ResignationRequestDialogComponent } from './resignation-request-dialog/resignation-request-dialog.component';
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
import { ResignationStatusComponent } from './resignation-status/resignation-status.component';

// import { ResignationComponent } from './resignation.component';


@NgModule({
  declarations: [
    ApprovedByMeComponent,
    RejectComponent,
    ResignationRequestDialogComponent,
    ApplyResignationComponent,
    ResignationStatusComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    ResignationRoutingModule,
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
    MatSelectFilterModule
  ]
})
export class ResignationModule { }
