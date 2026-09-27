import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AgGridModule } from 'ag-grid-angular';
import { TransportListRoutingModule } from './transport-list-routing.module';
import { TransportListComponent } from './transport-list.component';

@NgModule({
  declarations: [TransportListComponent],
  imports: [
    CommonModule,
    TransportListRoutingModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ShairedModule,
    AgGridModule,
  ],
})
export class TransportListModule {}
