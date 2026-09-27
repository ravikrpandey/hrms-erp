import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllTripRoutingModule } from './all-trip-routing.module';
import { AllTripComponent } from './all-trip.component';
import { ApprovedTripComponent } from './approved-trip/approved-trip.component';
import { ScheduleTripComponent } from './schedule-trip/schedule-trip.component';
import { LiveTripComponent } from './live-trip/live-trip.component';
import { ClosedTripComponent } from './closed-trip/closed-trip.component';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { AllTripActionComponent } from './all-trip-action/all-trip-action.component';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CreateScheduleTripComponent } from './create-schedule-trip/create-schedule-trip.component';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { LiveTripInfoComponent } from './live-trip-info/live-trip-info.component';
import { AddExpenseDialogComponent } from './add-expense-dialog/add-expense-dialog.component';


@NgModule({
  declarations: [
    AllTripComponent,
    ApprovedTripComponent,
    ScheduleTripComponent,
    LiveTripComponent,
    ClosedTripComponent,
    AllTripActionComponent,
    CreateScheduleTripComponent,
    LiveTripInfoComponent,
    AddExpenseDialogComponent
  ],
  imports: [
    CommonModule,
    AllTripRoutingModule,
    RouterModule,
    AgGridModule,
    MatIconModule,
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
    MaterialModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    CKEditorModule,
    MatButtonModule,
    MatSelectFilterModule,
    NgxMatTimepickerModule,
    SearchFilterComponent,



  ]
})
export class AllTripModule { }
