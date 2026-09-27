import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentAdviceVoucherRoutingModule } from './payment-advice-voucher-routing.module';
import { PaymentAdviceVoucherListComponent } from './payment-advice-voucher-list/payment-advice-voucher-list.component';
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
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AddPaymentAdviceVoucherComponent } from './add-payment-advice-voucher/add-payment-advice-voucher.component';
import { PaymentAdviceVoucherActionComponent } from './payment-advice-voucher-action/payment-advice-voucher-action.component';


@NgModule({
  declarations: [
    PaymentAdviceVoucherListComponent,
    AddPaymentAdviceVoucherComponent,
    PaymentAdviceVoucherActionComponent
  ],
  imports: [
    CommonModule,
    PaymentAdviceVoucherRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AgGridModule,
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
    MatSelectFilterModule
  ]
})
export class PaymentAdviceVoucherModule { }
