import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewPriceMasterRoutingModule } from './new-price-master-master-routing.module';
import { NewPriceMasterComponent } from './new-price-master.component';
import { NewPriceMasterActionComponent } from './new-price-master-action/new-price-master-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { NewPriceMasterDialogComponent } from './new-price-master-dialog/new-price-master-dialog.component';
@NgModule({
  declarations: [
    NewPriceMasterComponent,
    NewPriceMasterActionComponent,
    NewPriceMasterDialogComponent
  ],
  imports: [
    CommonModule,
    NewPriceMasterRoutingModule,
    MaterialModule,
    AgGridModule
  ]
})
export class NewPriceMasterModule { }
