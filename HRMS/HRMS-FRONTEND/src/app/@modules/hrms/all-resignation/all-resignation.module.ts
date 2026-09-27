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

import { AllResignationRoutingModule } from './all-resignation-routing.module';
import { AllResignationComponent } from './all-resignation.component';
import { AllResignationListingComponent } from './all-resignation-list/all-resignation-listing/all-resignation-listing.component';
import { AllResignationActionComponent } from './all-resignation-list/all-resignation-action/all-resignation-action.component';
import { AllResignationCreateComponent } from './all-resignation-list/all-resignation-create/all-resignation-create.component';
import { AllResignationReviewComponent } from './all-resignation-list/all-resignation-review/all-resignation-review.component';
import { AllResignationOffboardingComponent } from './all-resignation-list/all-resignation-offboarding/all-resignation-offboarding.component';


@NgModule({
  declarations: [
   AllResignationComponent,
   AllResignationListingComponent,
   AllResignationActionComponent,
   AllResignationCreateComponent,
   AllResignationReviewComponent,
   AllResignationOffboardingComponent
  ],
  imports: [
    CommonModule,
    AllResignationRoutingModule,
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
export class AllResignationModule { }
