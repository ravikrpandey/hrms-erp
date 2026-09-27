import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordPaymentRoutingModule } from './record-payment-routing.module';
import { RecordPaymentComponent } from './record-payment.component';
import { CreateRecordPaymentComponent } from './create-record-payment/create-record-payment.component';
import { ApprovedRecordPaymentComponent } from './approved-record-payment/approved-record-payment.component';
import { RejectedRecordPaymentComponent } from './rejected-record-payment/rejected-record-payment.component';
import { PendingRecordPaymentComponent } from './pending-record-payment/pending-record-payment.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';


@NgModule({
  declarations: [
    RecordPaymentComponent,
    CreateRecordPaymentComponent,
    ApprovedRecordPaymentComponent,
    RejectedRecordPaymentComponent,
    PendingRecordPaymentComponent
  ],
  imports: [
    CommonModule,
    RecordPaymentRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
    ShairedModule,
  ]
})
export class RecordPaymentModule { }
