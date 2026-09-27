import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetListRoutingModule } from './asset-list-routing.module';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AssetActionComponent } from './asset-action/asset-action.component';
import { AssetLogoComponent } from './asset-logo/asset-logo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { BasicDetailsComponent } from './asset-view/asset-header/basic-details/basic-details.component';
import { DocsComponent } from './asset-view/asset-header/docs/docs.component';
import { DepreciationComponent } from './asset-view/asset-header/depreciation/depreciation.component';
import { HistoryComponent } from './asset-view/asset-header/history/history.component';
import { AssetHeaderComponent } from './asset-view/asset-header/asset-header.component';
import { PoViewComponent } from './asset-view/po-view/po-view.component';
import { MaintenanceComponent } from './asset-view/asset-header/maintenance/maintenance.component';
import { WarrantyComponent } from './asset-view/asset-header/warranty/warranty.component';
import { CreateDirectAssetComponent } from './direct-asset/create-direct-asset/create-direct-asset.component';
import { AssetAllocationComponent } from './direct-asset/asset-allocation/asset-allocation.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AssetQRCodeComponent } from './asset-qr-code/asset-qr-code.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { BulkAllocationComponent } from './bulk-allocation/bulk-allocation.component';
import { AssetTransferNodeListComponent } from './asset-transfer-node-list/asset-transfer-node-list.component';
import { AssetTransferNodeActionComponent } from './asset-transfer-node-action/asset-transfer-node-action.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { SearchFilterComponent } from 'src/app/@modules/transport-management/search-filter/search-filter.component';
@NgModule({
  declarations: [
    AssetListComponent,
    AssetActionComponent,
    AssetLogoComponent,
    BasicDetailsComponent,
    DocsComponent,
    DepreciationComponent,
    HistoryComponent,
    AssetHeaderComponent,
    PoViewComponent,
    MaintenanceComponent,
    WarrantyComponent,
    CreateDirectAssetComponent,
    AssetAllocationComponent,
    AssetQRCodeComponent,
    BulkAllocationComponent,
    AssetTransferNodeListComponent,
    AssetTransferNodeActionComponent
  ],
  imports: [
    CommonModule,
    AssetListRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    MatCardModule,
    FormsModule,
    MatSelectFilterModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    ShairedModule,
    SearchFilterComponent
  ]
})
export class AssetListModule { }
