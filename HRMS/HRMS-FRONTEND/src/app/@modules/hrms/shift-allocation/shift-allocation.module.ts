import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftAllocationRoutingModule } from './shift-allocation-routing.module';
import { ShiftAllocationComponent } from './shift-allocation/shift-allocation.component';
import { ShiftAllocationListComponent } from './shift-allocation-list/shift-allocation-list.component';
import { ShiftAllocationActionComponent } from './shift-allocation-action/shift-allocation-action.component';
import { CellRenderComponent } from './cell-render/cell-render.component';


import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatIconModule } from '@angular/material/icon';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    ShiftAllocationComponent,
    ShiftAllocationListComponent,
    ShiftAllocationActionComponent,
    CellRenderComponent
  ],
  imports: [
    CommonModule,
    ShiftAllocationRoutingModule,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    ShairedModule,
    CKEditorModule,
    MatSelectFilterModule,
    MatIconModule,
    SearchFilterComponent
  ]
})
export class ShiftAllocationModule { }
