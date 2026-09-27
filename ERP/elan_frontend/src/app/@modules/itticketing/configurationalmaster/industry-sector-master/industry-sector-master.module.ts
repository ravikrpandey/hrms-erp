import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustrySectorMasterRoutingModule } from './industry-sector-master-routing.module';
import { IndustrySectorMasterComponent } from './industry-sector-master.component';
import { IsmActionComponent } from './ism-action/ism-action.component';
import { IsmDialogComponent } from './ism-dialog/ism-dialog.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    IndustrySectorMasterComponent,
    IsmActionComponent,
    IsmDialogComponent
  ],
  imports: [
    CommonModule,
    IndustrySectorMasterRoutingModule,
    AgGridModule,
    MaterialModule
  ]
})
export class IndustrySectorMasterModule { }
