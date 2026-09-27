import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FineManagementRoutingModule } from './fine-management-routing-module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { FineManagementList } from './fine-management-list/fine-management-list';
import { FineManagementCreate } from './fine-management-create/fine-management-create';
import { FineManagementAction } from './fine-management-action/fine-management-action';


@NgModule({
  declarations: [
    FineManagementList,
    FineManagementCreate,
    FineManagementAction
  ],
  imports: [
    CommonModule,
    FineManagementRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule
  ]
})
export class FineManagementModule { }
