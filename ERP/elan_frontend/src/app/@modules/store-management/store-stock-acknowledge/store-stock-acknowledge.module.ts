import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreStockAcknowledgeRoutingModule } from './store-stock-acknowledge-routing.module';
import { StoreStockAcknowledgeComponent } from './store-stock-acknowledge.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { CKEditorModule } from 'ckeditor4-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AllStockComponent } from './all-stock/all-stock.component';
import { PendingStockComponent } from './pending-stock/pending-stock.component';
import { ApprovedStockComponent } from './approved-stock/approved-stock.component';
import { RejectedStockComponent } from './rejected-stock/rejected-stock.component';
import { StockActionComponent } from './stock-action/stock-action.component';
import { StockStatusComponent } from './stock-status/stock-status.component';


@NgModule({
  declarations: [
    StoreStockAcknowledgeComponent,
    AllStockComponent,
    PendingStockComponent,
    ApprovedStockComponent,
    RejectedStockComponent,
    StockActionComponent,
    StockStatusComponent,
  ],
  imports: [
    CommonModule,
    StoreStockAcknowledgeRoutingModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
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
    CKEditorModule,
    AgGridModule,
    MatTabsModule
  ]
})
export class StoreStockAcknowledgeModule { }
