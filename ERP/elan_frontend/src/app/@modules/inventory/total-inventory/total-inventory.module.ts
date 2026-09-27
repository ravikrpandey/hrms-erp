import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TotalInventoryRoutingModule } from './total-inventory-routing.module';
import { TotalInventoryComponent } from './total-inventory.component';
import { TotalInventoryListComponent } from './total-inventory-list/total-inventory-list.component';
import { ActionComponent } from './total-inventory-list/action/action.component';
import { SerialAllocationComponent } from './serial-allocation/serial-allocation.component';
import { SerialAllocateCheckbox } from './serial-allocation/serial-allocate-checkbox/serial-allocate-checkbox.component';
import { BatchAllocateComponent } from './batch-allocation/batch-allocate/batch-allocate.component';
import { BatchAllocationComponent } from './batch-allocation/batch-allocation.component';
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
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    TotalInventoryListComponent,
    ActionComponent,
    SerialAllocationComponent,
    SerialAllocateCheckbox,
    BatchAllocationComponent,
    BatchAllocateComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    TotalInventoryRoutingModule,
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
  providers: [DatePipe]
})
export class TotalInventoryModule {}
