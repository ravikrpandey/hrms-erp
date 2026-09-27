
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { CashBookRoutingModule } from './cash-book-routing.module';
import { CashBookComponent } from './cash-book.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomerAdvanceFormComponent } from './customer-advance-form/customer-advance-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MoneyOutFormComponent } from './money-out-form/money-out-form.component';
import { FundTransferComponent } from './fund-transfer/fund-transfer.component';
import { CashBookActionComponent } from './cash-book-action/cash-book-action.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CashBookReceiptComponent } from './cash-book-receipt/cash-book-receipt.component';
import { CashPaymentVoucherComponent } from './cash-payment-voucher/cash-payment-voucher.component';


@NgModule({
  declarations: [
    CashBookComponent,
    CustomerAdvanceFormComponent,
    MoneyOutFormComponent,
    FundTransferComponent,
    CashBookActionComponent,
    CashBookReceiptComponent,
    CashPaymentVoucherComponent,
  ],
  imports: [
    CommonModule,
    CashBookRoutingModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatMenuModule,
    MatSidenavModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
     MatButtonModule,
    MatSelectFilterModule

  ]
})
export class CashBookModule { }
