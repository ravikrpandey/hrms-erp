import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRfpRoutingModule } from './manage-rfp-routing.module';
import { ManageRfpComponent } from './manage-rfp.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';


@NgModule({
  declarations: [
    ManageRfpComponent
  ],
  imports: [
    CommonModule,
    ManageRfpRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    ShairedModule
  ]
})
export class ManageRfpModule { }
