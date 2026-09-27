import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProformaInvoiceRoutingModule } from './proforma-invoice-routing.module';
import { ProformaListComponent } from './proforma-list/proforma-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ProformaActionComponent } from './proforma-action/proforma-action.component';


@NgModule({
  declarations: [
    ProformaListComponent,
    ProformaActionComponent,
    
  ],
  imports: [
    CommonModule,
    ProformaInvoiceRoutingModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class ProformaInvoiceModule { }
