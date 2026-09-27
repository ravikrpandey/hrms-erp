import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterVoucherTypeRoutingModule } from './master-voucher-type-routing.module';
import { MasterVoucherListComponent } from './master-voucher-list/master-voucher-list.component';
import { AddVoucherMasterComponent } from './add-voucher-master/add-voucher-master.component';
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
import { VoucherMasterActionComponent } from './voucher-master-action/voucher-master-action.component';


@NgModule({
  declarations: [
    MasterVoucherListComponent,
    AddVoucherMasterComponent,
    VoucherMasterActionComponent
  ],
  imports: [
    CommonModule,
    MasterVoucherTypeRoutingModule,
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
export class MasterVoucherTypeModule { }
