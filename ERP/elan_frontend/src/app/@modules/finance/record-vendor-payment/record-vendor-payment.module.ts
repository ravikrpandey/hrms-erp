import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordVendorPaymentRoutingModule } from './record-vendor-payment-routing.module';
import { VendorPaymentListComponent } from './vendor-payment-list/vendor-payment-list.component';
import { CreateVendorPaymentComponent } from './create-vendor-payment/create-vendor-payment.component';
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
import { NgImageSliderModule } from 'ng-image-slider';
import { NgChartsModule } from 'ng2-charts';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    VendorPaymentListComponent,
    CreateVendorPaymentComponent
  ],
  imports: [
    CommonModule,
    RecordVendorPaymentRoutingModule,
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
    MatSelectFilterModule,
    NgChartsModule,
    NgImageSliderModule,
    MatSelectFilterModule
  ]
})
export class RecordVendorPaymentModule { }
