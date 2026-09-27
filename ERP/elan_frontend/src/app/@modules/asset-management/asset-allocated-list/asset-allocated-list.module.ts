import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetAllocatedListRoutingModule } from './asset-allocated-list-routing.module';
import { AssetAllocatedListComponent } from './asset-allocated-list.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AllocatedActionComponent } from './allocated-action/allocated-action.component';
import { AllocatedDetailsComponent } from './allocated-details/allocated-details.component';


@NgModule({
  declarations: [
    AssetAllocatedListComponent,
    AllocatedActionComponent,
    AllocatedDetailsComponent
  ],
  imports: [
    CommonModule,
    AssetAllocatedListRoutingModule,
    ShairedModule,
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
export class AssetAllocatedListModule { }
