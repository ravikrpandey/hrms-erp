import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionComponent } from './production-total-inventory-list/action/action.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
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
import { ProductionTotalInventoryListComponent } from './production-total-inventory-list/production-total-inventory-list.component';
import { ProductionSerialAllocationComponent } from './production-serial-allocation/production-serial-allocation.component';
import { ProductionSerialAllocateCheckbox } from './production-serial-allocation/production-serial-allocate-checkbox/production-serial-allocate-checkbox.component';
import { ProductionBatchAllocationComponent } from './production-batch-allocation/production-batch-allocation.component';
import { ProductionBatchAllocateComponent } from './production-batch-allocation/production-batch-allocate/production-batch-allocate.component';
import { ProductionInventoryAllocationRoutingModule } from './production-inventory-allocation-routing.module';
import { ProductionInventoryAllocationComponent } from './production-inventory-allocation.component';
import { ViewProductionInventoryComponent } from './view-production-inventory/view-production-inventory.component';

@NgModule({
  declarations: [
    ProductionInventoryAllocationComponent,
    ProductionTotalInventoryListComponent,
    ActionComponent,
    ProductionSerialAllocationComponent,
    ProductionSerialAllocateCheckbox,
    ProductionBatchAllocationComponent,
    ProductionBatchAllocateComponent,
    ViewProductionInventoryComponent
  ],
  imports: [
    CommonModule,
    ProductionInventoryAllocationRoutingModule,
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
  ],
})
export class ProductionInventoryAllocationModule {}
