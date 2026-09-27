import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovedListRoutingModule } from './approved-list-routing.module';
import { ApprovedListComponent } from './approved-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';

import { ActiveStatusComponent } from './active-status/active-status.component';
import { ActionApprovedComponent } from './action/action.component';
import { VendorDilogComponentApp } from './vendor-dilog/vendor-dilog.component';

@NgModule({
  declarations: [
    ApprovedListComponent,
    ActionApprovedComponent,
    ActiveStatusComponent,
    VendorDilogComponentApp

  ],
  imports: [
    CommonModule,
    ApprovedListRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ApprovedListModule { }
