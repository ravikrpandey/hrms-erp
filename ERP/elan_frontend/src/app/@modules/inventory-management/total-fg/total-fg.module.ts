import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TotalFgRoutingModule } from './total-fg-routing.module';
import { TotalFgComponent } from './total-fg.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';


@NgModule({
  declarations: [
    TotalFgComponent
  ],
  imports: [
    CommonModule,
    TotalFgRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TotalFgModule { }
