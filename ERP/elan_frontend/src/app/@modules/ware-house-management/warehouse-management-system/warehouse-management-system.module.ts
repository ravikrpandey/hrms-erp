import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseManagementSystemRoutingModule } from './warehouse-management-system-routing.module';
import { WarehouseManagementSystemComponent } from './warehouse-management-system.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ComplaintModule } from '../../employee-self-service/complaint/complaint.module';
import { TimesheetModule } from '../../employee-self-service/timesheet/timesheet.module';
import { AddNewRowComponent } from './add-new-row/add-new-row.component';
import { AddNewSelfComponent } from './add-new-self/add-new-self.component';
import { AddNewSectionComponent } from './add-new-section/add-new-section.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { WarebifurcationNewComponent } from './warebifurcation-new/warebifurcation-new.component';
// import { WarehousebifurcationActionComponent } from './warehousebifurcation-action/warehousebifurcation-action.component';
  import {WarehousebifurcationActionComponent} from '../../../@modules/ware-house-management/warehouse-management-system/warehousebifurcation-action/warehousebifurcation-action.component'
  import { DragDropModule } from '@angular/cdk/drag-drop';
import { WarehouseDesignComponent } from './warehouse-design/warehouse-design.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { RecievingItemsComponent } from './recieving-items/recieving-items.component';
import { AllocateItemsComponent } from './allocate-items/allocate-items.component';
import { WarehouseItemsComponent } from './warehouse-items/warehouse-items.component'



@NgModule({
  declarations: [
    WarehouseManagementSystemComponent,
    AddNewRowComponent,
    AddNewSelfComponent,
    AddNewSectionComponent,
    ViewDetailsComponent,
    WarebifurcationNewComponent,
    WarehousebifurcationActionComponent,
    WarehouseDesignComponent,
    RecievingItemsComponent,
    AllocateItemsComponent,
    WarehouseItemsComponent
    
  ],
  imports: [
    CommonModule,
    WarehouseManagementSystemRoutingModule,
    RouterOutlet,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    ComplaintModule,
    TimesheetModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    DragDropModule,
    MatExpansionModule,
    DragDropModule
  ]
})
export class WarehouseManagementSystemModule { }
