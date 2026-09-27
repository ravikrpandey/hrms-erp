import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentProgramRoutingModule } from './payment-program-routing.module';
import { PaymentProgramListComponent } from './payment-program-list/payment-program-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { PaymentProgramDialogComponent } from './payment-program-dialog/payment-program-dialog.component';


@NgModule({
  declarations: [
    PaymentProgramListComponent,
    PaymentProgramDialogComponent
  ],
  imports: [
    CommonModule,
    PaymentProgramRoutingModule,
     AgGridModule,
        MaterialModule,
        HttpClientModule,
        FormsModule,
       MatSelectFilterModule,
        ReactiveFormsModule,
        ShairedModule,
  ]
})
export class PaymentProgramModule { }
