import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EInvoiceRoutingModule } from './e-invoice-routing.module';
import { EInvoiceListComponent } from './e-invoice-list/e-invoice-list.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { EInvoiceActionComponent } from './e-invoice-action/e-invoice-action.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    EInvoiceListComponent,
    EInvoiceActionComponent,
  ],
  imports: [
    CommonModule,
    EInvoiceRoutingModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
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
export class EInvoiceModule { }
