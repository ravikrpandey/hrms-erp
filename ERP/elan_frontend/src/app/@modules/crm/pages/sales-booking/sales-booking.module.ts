import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesBookingRoutingModule } from './sales-booking-routing.module';
import { SalesBookingListComponent } from './sales-booking-list/sales-booking-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { SalesBookingActionComponent } from './sales-booking-action/sales-booking-action.component';
import { SalesBookingMainComponent } from './sales-booking-main/sales-booking-main.component';
import { SalesBookingPendingComponent } from './sales-booking-pending/sales-booking-pending.component';
import { SalesBookingApprovedComponent } from './sales-booking-approved/sales-booking-approved.component';
import { SalesBookingRejectComponent } from './sales-booking-reject/sales-booking-reject.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UpdatedSalesBookComponent } from './updated-sales-book/updated-sales-book.component';


@NgModule({
  declarations: [
    SalesBookingListComponent,
    SalesBookingActionComponent,
    SalesBookingMainComponent,
    SalesBookingPendingComponent,
    SalesBookingApprovedComponent,
    SalesBookingRejectComponent,
    UpdatedSalesBookComponent
  ],
  imports: [
    CommonModule,
    SalesBookingRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    ShairedModule ,
    MatSidenavModule,
    MatDatepickerModule
  ]
})
export class SalesBookingModule { }
