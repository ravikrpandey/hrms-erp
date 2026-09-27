import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyDepreciationMasteRoutingModule } from './company-depreciation-maste-routing.module';
import { DepreciationMasterComponent } from './depreciation-master/depreciation-master.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { CreateDepreciationComponent } from './create-depreciation/create-depreciation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepreciationActionComponent } from './depreciation-action/depreciation-action.component';


@NgModule({
  declarations: [
    DepreciationMasterComponent,
    CreateDepreciationComponent,
    DepreciationActionComponent
  ],
  imports: [
    CommonModule,
    CompanyDepreciationMasteRoutingModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CompanyDepreciationMasteModule { }
