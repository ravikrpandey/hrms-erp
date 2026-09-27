import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductMasterRoutingModule } from './product-master-routing.module';
import { ProductMasterListComponent } from './product-master-list/product-master-list.component';
import { ProductMasterDialogComponent } from './product-master-dialog/product-master-dialog.component';
import { ProductMasterCreateComponent } from './product-master-create/product-master-create.component';
import { ProductMasterActionComponent } from './product-master-action/product-master-action.component';
import { ProductMasterStatusComponent } from './product-master-action/product-master-status/product-master-status.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    ProductMasterListComponent,
    ProductMasterDialogComponent,
    ProductMasterCreateComponent,
    ProductMasterActionComponent,
    ProductMasterStatusComponent
  ],
  imports: [
    CommonModule,
    ProductMasterRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule,

  ]
})
export class ProductMasterModule { }
