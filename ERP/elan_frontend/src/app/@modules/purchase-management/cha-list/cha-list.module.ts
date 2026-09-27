import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AgGridModule } from 'ag-grid-angular';
import { CHAListRoutingModule } from './cha-list-routing.module';
import { ChaListComponent } from './cha-list.component';

@NgModule({
  declarations: [ChaListComponent],
  imports: [
    CommonModule,
    CHAListRoutingModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ShairedModule,
    AgGridModule,
  ],
})
export class CHAListModule {}
