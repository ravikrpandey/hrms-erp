import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RejectVendorListRoutingModule } from './reject-vendor-list-routing.module';
import { RejectVendorListComponent } from './reject-vendor-list.component';
import { RejectActionComponent } from './reject-action/reject-action.component';
import { RejectDailogComponent } from './reject-dailog/reject-dailog.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    RejectVendorListComponent,
    RejectActionComponent,
    RejectDailogComponent
  ],
  imports: [
    CommonModule,
    RejectVendorListRoutingModule,
    AgGridModule,
    MaterialModule
  ]
})
export class RejectVendorListModule { }
