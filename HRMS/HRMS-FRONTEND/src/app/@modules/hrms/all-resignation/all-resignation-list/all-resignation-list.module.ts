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

import { AllResignationListRoutingModule } from './all-resignation-list-routing.module';
import { AllResignationListingComponent } from './all-resignation-listing/all-resignation-listing.component';
import { AllResignationActionComponent } from './all-resignation-action/all-resignation-action.component';
import { AllResignationCreateComponent } from './all-resignation-create/all-resignation-create.component';
import { AllResignationReviewComponent } from './all-resignation-review/all-resignation-review.component';
import { AllResignationOffboardingComponent } from './all-resignation-offboarding/all-resignation-offboarding.component';


@NgModule({
  declarations: [
    AllResignationListingComponent,
    AllResignationActionComponent,
    AllResignationCreateComponent,
    AllResignationReviewComponent,
    AllResignationOffboardingComponent,
    

  ],
  imports: [
    CommonModule,
    AllResignationListRoutingModule,
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
export class AllResignationListModule { }
