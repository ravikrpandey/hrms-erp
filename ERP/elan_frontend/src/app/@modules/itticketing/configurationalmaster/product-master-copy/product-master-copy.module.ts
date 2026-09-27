import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductMasterCopyRoutingModule } from './product-master-copy-routing.module';
import { ProductMasterCopyComponent } from './product-master-copy/product-master-copy.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ProductCopyActionComponent } from './product-copy-action/product-copy-action.component';
import { ProductCopyDialogComponent } from './product-copy-dialog/product-copy-dialog.component';


@NgModule({
  declarations: [
    ProductMasterCopyComponent,
    ProductCopyActionComponent,
    ProductCopyDialogComponent
  ],
  imports: [
    CommonModule,
    ProductMasterCopyRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule,
  ]
})
export class ProductMasterCopyModule { }
