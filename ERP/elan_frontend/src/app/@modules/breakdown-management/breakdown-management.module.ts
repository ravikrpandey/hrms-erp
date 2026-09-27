import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreakdownManagementRoutingModule } from './breakdown-management-routing.module';
import { BreakdownManagementComponent } from './breakdown-management/breakdown-management.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BreakdownManagementComponent
  ],
  imports: [
    CommonModule,
    BreakdownManagementRoutingModule,
    ShairedModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class BreakdownManagementModule { }
