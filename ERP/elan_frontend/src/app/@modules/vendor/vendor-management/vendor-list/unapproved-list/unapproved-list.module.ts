import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnapprovedListRoutingModule } from './unapproved-list-routing.module';
import { UnapprovedListComponent } from './unapproved-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActiveStatusComponent } from './active-status/active-status.component';
import { ActionComponent } from './action/action.component';
import { VendorDilogComponent } from './vendor-dilog/vendor-dilog.component';



@NgModule({
  declarations: [
    UnapprovedListComponent,
    ActiveStatusComponent,
    ActionComponent,
    ActiveStatusComponent,
    VendorDilogComponent
  ],
  imports: [
    CommonModule,
    UnapprovedListRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UnapprovedListModule { }
