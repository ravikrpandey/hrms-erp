import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockInTransitRoutingModule } from './stock-in-transit-routing.module';
import { StockInTransitComponent } from './stock-in-transit.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    StockInTransitComponent
  ],
  imports: [
    CommonModule,
    StockInTransitRoutingModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StockInTransitModule { }
