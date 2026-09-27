import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { BankReceiptVoucherRoutingModule } from './bank-receipt-voucher-routing.module';
import { BankReceiptVoucherListComponent } from './bank-receipt-voucher-list/bank-receipt-voucher-list.component';
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
import { AddBankRecieptVoucherComponent } from './add-bank-reciept-voucher/add-bank-reciept-voucher.component';
import { BankRecieptActionComponent } from './bank-reciept-action/bank-reciept-action.component';


@NgModule({
  declarations: [
    BankReceiptVoucherListComponent,
    AddBankRecieptVoucherComponent,
    BankRecieptActionComponent
  ],
  imports: [
    CommonModule,
    BankReceiptVoucherRoutingModule,
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
export class BankReceiptVoucherModule { }
 