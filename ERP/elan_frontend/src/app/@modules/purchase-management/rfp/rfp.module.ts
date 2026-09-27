import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RfpRoutingModule } from './rfp-routing.module';
import { RfpComponent } from './rfp.component';
import { RfpListActionComponent } from './rfp-list-action/rfp-list-action.component';
import { CreateRfpComponent } from './create-rfp/create-rfp.component';
import { RouterModule } from '@angular/router';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { RfpQuotationDetailsComponent } from './rfp-quotation-details/rfp-quotation-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RfpComponent,
    RfpListActionComponent,
    CreateRfpComponent,
    RfpQuotationDetailsComponent
  ],
  imports: [
    CommonModule,
    RfpRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RfpModule { }
