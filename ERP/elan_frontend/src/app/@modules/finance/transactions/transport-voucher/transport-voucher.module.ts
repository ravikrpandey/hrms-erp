import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportVoucherRoutingModule } from './transport-voucher-routing.module';
import { TransportVoucherListComponent } from './transport-voucher-list/transport-voucher-list.component';
import { AddTransportVoucherComponent } from './add-transport-voucher/add-transport-voucher.component';
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
import { TransportActionComponent } from './transport-action/transport-action.component';
import { DownloadTransportVoucherComponent } from './download-transport-voucher/download-transport-voucher.component';


@NgModule({
  declarations: [
    TransportVoucherListComponent,
    AddTransportVoucherComponent,
    TransportActionComponent,
    DownloadTransportVoucherComponent
  ],
  imports: [
    CommonModule,
    TransportVoucherRoutingModule,
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
    MatSelectFilterModule
  ]
})
export class TransportVoucherModule { }
