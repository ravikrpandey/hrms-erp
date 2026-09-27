import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { AssetManagementRoutingModule } from './asset-management-routing.module';
import { AssetManagementComponent } from './asset-management.component';
import { ExcelDialogComponent } from './depreciation-forecast/excel-dialog/excel-dialog.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { UploadExcelDialogComponent } from './upload-excel-dialog/upload-excel-dialog.component';
import { AssetSaleWriteoffComponent } from './asset-sale-writeoff/asset-sale-writeoff.component';
import { AssetSaleWriteoffFormComponent } from './asset-sale-writeoff-form/asset-sale-writeoff-form.component';
import { AssetDashboardComponent } from './asset-dashboard/asset-dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { AssetRevaluationComponent } from './asset-revaluation/asset-revaluation.component';
import { AssetRevaluationFormComponent } from './asset-revaluation-form/asset-revaluation-form.component';
import { AssetWriteOffApprovalComponent } from './asset-write-off-approval/asset-write-off-approval.component';
import { AssetSoldApprovalComponent } from './asset-sold-approval/asset-sold-approval.component';

@NgModule({
  declarations: [
    AssetManagementComponent,
    ExcelDialogComponent,
    UploadExcelDialogComponent,
    AssetSaleWriteoffComponent,
    AssetSaleWriteoffFormComponent,
    AssetDashboardComponent,
    AssetRevaluationComponent,
    AssetRevaluationFormComponent,
    AssetWriteOffApprovalComponent,
    AssetSoldApprovalComponent
  ],
  imports: [
    CommonModule,
    AssetManagementRoutingModule,
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
    MatSelectFilterModule,
    NgChartsModule
  ]
})
export class AssetManagementModule { }
