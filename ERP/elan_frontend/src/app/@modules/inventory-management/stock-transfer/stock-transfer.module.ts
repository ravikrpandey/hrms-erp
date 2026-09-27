import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockTransferRoutingModule } from './stock-transfer-routing.module';
import { StockTransferComponent } from './stock-transfer.component';


@NgModule({
  declarations: [
    StockTransferComponent
  ],
  imports: [
    CommonModule,
    StockTransferRoutingModule
  ]
})
export class StockTransferModule { }
