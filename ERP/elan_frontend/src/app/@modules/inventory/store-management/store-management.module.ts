import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreManagementRoutingModule } from './store-management-routing.module';
import { StoreManagementComponent } from './store-management.component';
import { StoreManagementActionComponent } from './store-management-action/store-management-action.component';
import { StoreManagementDialogueComponent } from './store-management-dialogue/store-management-dialogue.component';
import { StoreManagementListComponent } from './store-management-list/store-management-list.component';
import { StoreManagementStatusComponent } from './store-management-status/store-management-status.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AssignUserModule } from '../../crm/assign-user/assign-user.module';
import { InventoryRoutingModule } from '../inventory-routing.module';
import { TotalInventoryModule } from '../total-inventory/total-inventory.module';


@NgModule({
  declarations: [
    StoreManagementComponent,
    StoreManagementStatusComponent,
    StoreManagementDialogueComponent,
    StoreManagementActionComponent,
    StoreManagementListComponent,
  ],
  imports: [
    CommonModule,
    StoreManagementRoutingModule,
    CommonModule,
    InventoryRoutingModule,
    MatButtonModule,
    MatSelectFilterModule,
    MaterialModule,
    AgGridModule,
    MatSlideToggleModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
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
    AssignUserModule,
    MatTabsModule,
    TotalInventoryModule
  ]
})
export class StoreManagementModule { }
