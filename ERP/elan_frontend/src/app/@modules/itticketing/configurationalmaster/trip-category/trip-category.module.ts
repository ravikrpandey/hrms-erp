import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripCategoryRoutingModule } from './trip-category-routing.module';
import { TripCategoryComponent } from './trip-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ReasonRoutingModule } from '../reason/reason-routing.module';
import { AddTripCategoryComponent } from './add-trip-category/add-trip-category.component';
import { ActionTripCategoryComponent } from './action-trip-category/action-trip-category.component';
import { tripCategoryComponent } from './action-trip-category/trip-category-status/trip-category-status.component';


@NgModule({
  declarations: [
    TripCategoryComponent,
    AddTripCategoryComponent,
    ActionTripCategoryComponent,
    tripCategoryComponent
    
  ],
  imports: [
    CommonModule,
    TripCategoryRoutingModule,
        ReasonRoutingModule,
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
        MatTooltipModule
  ]
})
export class TripCategoryModule { }
