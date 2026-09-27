import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WareHouseManagementRoutingModule } from './ware-house-management-routing.module';
import { WareHouseManagementComponent } from './ware-house-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { CKEditorModule } from 'ckeditor4-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ComplaintModule } from '../employee-self-service/complaint/complaint.module';
import { TimesheetModule } from '../employee-self-service/timesheet/timesheet.module';
import { GoodsInventoryModule } from './goods-inventory/goods-inventory.module';
import { DispatchListComponent } from './dispatch-list/dispatch-list.component';
import { DispatchedProductComponent } from './dispatch-list/dispatched-product/dispatched-product.component';
import { DispatchListFormComponent } from './dispatch-list/dispatch-list-form/dispatch-list-form.component';
import { DispatchListActionComponent } from './dispatch-list/dispatch-list-action/dispatch-list-action.component';
import { DispatchListFormDialogComponent } from './dispatch-list/dispatch-list-form/dispatch-list-form-dialog/dispatch-list-form-dialog.component';
import { DispatchListFormActionComponent } from './dispatch-list/dispatch-list-form/dispatch-list-form-action/dispatch-list-form-action.component';
import { OrderDispatchedListComponent } from './dispatch-list/order-dispatched-list/order-dispatched-list.component';
import { OrderDispatchDetailsViewComponent } from './dispatch-list/order-dispatch-details-view/order-dispatch-details-view.component';
import { WarehouseStatusComponent } from './warehouse-status/warehouse-status.component';
import { WarehouseActionComponent } from './warehouse-action/warehouse-action.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { DispatchDialogComponent } from './dispatch-list/dispatch-dialog/dispatch-dialog.component';
import { StockTransferNewComponent } from './stock-transfer-new/stock-transfer-new.component';
import { AddStockTransferComponent } from './stock-transfer-new/add-stock-transfer/add-stock-transfer.component';
import { SerialSelectionDialogComponent } from './stock-transfer-new/add-stock-transfer/serial-selection-dialog.component';
import { AddActionComponent } from './stock-transfer-new/add-action/add-action.component';
import { ProceedToDispatchComponent } from './dispatch-list/proceed-to-dispatch/proceed-to-dispatch.component';
import { UploadSoDocComponent } from './dispatch-list/upload-so-doc/upload-so-doc.component';
import { DeliveryListComponent } from './delivery-management/delivery-list.component';
import { DeliveryActionComponent } from './delivery-management/delivery-action/delivery-action.component';
import { AcknowledgePlanningComponent } from './acknowledge-planning/acknowledge-planning.component';
import { AcknowledgeActionComponent } from './acknowledge-planning/acknowledge-action/acknowledge-action.component';
import { GenerateIrnListComponent } from './generate-irn/generate-irn-list/generate-irn-list.component';
import { GenerateEwayComponent } from '../sales/sales-invoice/generate-eway/generate-eway.component';
import { EInvoiceListComponent } from './e-invoice/e-invoice-list/e-invoice-list.component';

@NgModule({
  declarations: [
    WareHouseManagementComponent,
    DispatchListComponent,
    DispatchedProductComponent,
    DispatchListFormComponent,
    DispatchListActionComponent,
    DispatchListFormDialogComponent,
    DispatchListFormActionComponent,
    OrderDispatchedListComponent,
    OrderDispatchDetailsViewComponent,
    WarehouseStatusComponent,
    WarehouseActionComponent,
    DispatchDialogComponent,
    StockTransferNewComponent,
    AddStockTransferComponent,
    SerialSelectionDialogComponent,
    AddActionComponent,
    ProceedToDispatchComponent,
    UploadSoDocComponent,
    DeliveryListComponent,
    DeliveryActionComponent,
    AcknowledgePlanningComponent,
    AcknowledgeActionComponent,
    // GenerateIrnListComponent,
    // GenerateEwayComponent,
    // EInvoiceListComponent,
  ],
  imports: [
    CommonModule,
    WareHouseManagementRoutingModule,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    GoodsInventoryModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    ComplaintModule,
    TimesheetModule,
    FormsModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    CKEditorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    MatSelectFilterModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class WareHouseManagementModule { }
