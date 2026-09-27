import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { CKEditorModule } from 'ckeditor4-angular';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AssignUserModule } from '../crm/assign-user/assign-user.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectFilterModule } from 'mat-select-filter';
import { TotalInventoryComponent } from './total-inventory/total-inventory.component';
import { TotalInventoryModule } from './total-inventory/total-inventory.module';
import { ProductionInventoryAllocationModule } from './production-inventory-allocation/production-inventory-allocation.module';
import { MaterialRequestListComponent } from './material-request/material-request-list/material-request-list.component';
import { MaterialRequestApprovalComponent } from './material-request-approval/material-request-approval.component';
@NgModule({
  declarations: [
    InventoryComponent,
    TotalInventoryComponent,
    InventoryComponent,
    MaterialRequestListComponent,
    MaterialRequestApprovalComponent,
    
  ],
  imports: [
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
    TotalInventoryModule,
    ProductionInventoryAllocationModule
  ]
})
export class InventoryModule { }
