import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { AssetCategoryRoutingModule } from './accessory-category-routing.module';
import { AccessoryCategoryComponent } from './accessory-category.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AccessoryCategoryRoutingModule } from './accessory-category-routing.module';
import { AccessoryCategoryDilogComponent } from './accessory-category-dilog/accessory-category-dilog.component';
import { AccessoryCategoryActionComponent } from './accessory-category-action/accessory-category-action.component';
import { AccessoryCategoryStatusActionComponent } from './accessory-category-action/accessory-category-status-action/accessory-category-status-action.component';




@NgModule({
  declarations: [
    // AssetCategoryComponent,
    // AssetCategoryActionComponent,
    // AssetCategoryDilogComponent,
    // AssetCategoryStatusActionComponent
    AccessoryCategoryComponent,
    AccessoryCategoryDilogComponent,
    AccessoryCategoryActionComponent,
    AccessoryCategoryStatusActionComponent
  ],
  imports: [
    CommonModule,
    AccessoryCategoryRoutingModule,
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
export class  AccessoryCategoryModule { }
