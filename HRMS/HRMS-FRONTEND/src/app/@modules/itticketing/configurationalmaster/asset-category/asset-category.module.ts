import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetCategoryRoutingModule } from './asset-category-routing.module';
import { AssetCategoryComponent } from './asset-category.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { AssetCategoryActionComponent } from './asset-category-action/asset-category-action.component';
import { AssetCategoryDilogComponent } from './asset-category-dilog/asset-category-dilog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssetCategoryStatusActionComponent } from './asset-category-action/asset-category-status-action/asset-category-status-action.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    AssetCategoryComponent,
    AssetCategoryActionComponent,
    AssetCategoryDilogComponent,
    AssetCategoryStatusActionComponent
  ],
  imports: [
    CommonModule,
    AssetCategoryRoutingModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatSelectFilterModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule


  ]
})
export class AssetCategoryModule { }
