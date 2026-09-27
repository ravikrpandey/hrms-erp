import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
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
import { CreateSalesInvoiceComponent } from './create-sales-invoice/create-sales-invoice.component';
import { ApprovedSalesInvoiceComponent } from './approved-sales-invoice/approved-sales-invoice.component';
import { PendingSalesInvoiceComponent } from './pending-sales-invoice/pending-sales-invoice.component';
import { RejectedSalesInvoiceComponent } from './rejected-sales-invoice/rejected-sales-invoice.component';

import { SaleInvoiceActionComponent } from './sale-invoice-action/sale-invoice-action.component';
import { SaleInvoiceStatusComponent } from './sale-invoice-status/sale-invoice-status.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    SalesComponent,
    CreateSalesInvoiceComponent,
    ApprovedSalesInvoiceComponent,
    PendingSalesInvoiceComponent,
    RejectedSalesInvoiceComponent,
    SaleInvoiceActionComponent,
    SaleInvoiceStatusComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,

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

    MatIconModule
  ]
})
export class SalesModule { }
