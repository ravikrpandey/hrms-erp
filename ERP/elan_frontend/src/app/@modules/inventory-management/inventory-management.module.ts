import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryManagementRoutingModule } from './inventory-management-routing.module';
import { InventoryManagementComponent } from './inventory-management.component';
import { RouterModule } from '@angular/router';
import { InventoryDashboardComponent } from './inventory-dashboard/inventory-dashboard.component';
import { ItemAllocationDialogComponent } from './dialog/item-allocation-dialog/item-allocation-dialog.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module'; import { InventoryStockListComponent } from './inventory-stock-list/inventory-stock-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { InventoryLedgerListComponent } from './inventory-ledger-list/inventory-ledger-list.component';
import { AddDirectInventoryComponent } from './add-direct-inventory/add-direct-inventory.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { BatchSerialCreationComponent } from './dialog/batch-serial-creation/batch-serial-creation.component';


@NgModule({
  declarations: [
    InventoryManagementComponent,
    InventoryDashboardComponent,
    ItemAllocationDialogComponent,
    InventoryStockListComponent,
    InventoryLedgerListComponent,
    AddDirectInventoryComponent,
    BatchSerialCreationComponent
  ],
  imports: [
    CommonModule,
    InventoryManagementRoutingModule,
    RouterModule,
    ShairedModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    AgGridModule,
    MatSelectFilterModule,
    NgxMatSelectSearchModule
  ]
})
export class InventoryManagementModule { }
