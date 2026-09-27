import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from 'ag-grid-angular';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatChipsModule } from '@angular/material/chips';

import { AssetAllotmentRoutingModule } from './asset-allotment-routing-module';
import { AssetAllotment } from './asset-allotment';
import { AssetAllotmentComponent } from './asset-allotment-component/asset-allotment-component';
import { AssetAllotmentCompAction } from './asset-allotment-component/asset-allotment-comp-action/asset-allotment-comp-action';
import { AssetAllotmentCompDialog } from './asset-allotment-component/asset-allotment-comp-dialog/asset-allotment-comp-dialog';
import { AssetAllotmentCompStatus } from './asset-allotment-component/asset-allotment-comp-status/asset-allotment-comp-status';


@NgModule({
  declarations: [
    AssetAllotment,
    AssetAllotmentComponent,
    AssetAllotmentCompAction,
    AssetAllotmentCompDialog,
    AssetAllotmentCompStatus
  ],
  imports: [
    CommonModule,
    AssetAllotmentRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    AgGridModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectFilterModule,
    MatChipsModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    ShairedModule
  ]
})
export class AssetAllotmentModule { }
