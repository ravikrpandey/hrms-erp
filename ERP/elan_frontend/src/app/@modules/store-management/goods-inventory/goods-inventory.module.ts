import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoodsInventoryRoutingModule } from './goods-inventory-routing.module';
import { GoodsInventoryComponent } from './goods-inventory.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AddActionComponent } from './add-goods-inventory/add-action/add-action.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { ItemlistDialogComponent } from './view-details/itemlist-dialog/itemlist-dialog.component';
import { AddGoodsInventoryComponent } from './add-goods-inventory/add-goods-inventory.component';
@NgModule({
  declarations: [
    GoodsInventoryComponent,
    AddGoodsInventoryComponent,
    AddActionComponent,
    ViewDetailsComponent,
    ItemlistDialogComponent
  ],
  imports: [
    CommonModule,
    GoodsInventoryRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    MatSelectFilterModule
  ]
})
export class GoodsInventoryModule { }
