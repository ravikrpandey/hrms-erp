import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveQuotaRoutingModule } from './leave-quota-routing-module';
import { LeaveQuota } from './leave-quota';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchFilterComponent } from "src/app/@shared/components/search-filter/search-filter.component";


@NgModule({
  declarations: [
    LeaveQuota
  ],
  imports: [
    CommonModule,
    LeaveQuotaRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule,
    CKEditorModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectFilterModule,
    SearchFilterComponent
]
})
export class LeaveQuotaModule { }
