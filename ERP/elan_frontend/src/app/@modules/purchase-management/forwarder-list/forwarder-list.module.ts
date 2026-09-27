import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AgGridModule } from 'ag-grid-angular';
import { ForwarderListComponent } from './forwarder-list.component';
import { ForwarderListRoutingModule } from './forwarder-list-routing.module';

@NgModule({
  declarations: [ForwarderListComponent],
  imports: [
    CommonModule,
    ForwarderListRoutingModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ShairedModule,
    AgGridModule,
  ],
})
export class ForwarderListModule {}
