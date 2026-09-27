import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionRoutingModule } from './production-routing.module';
import { ProductionComponent } from './production.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
 
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { CKEditorModule } from 'ckeditor4-angular';
// import { AssignUserModule } from '../crm/assign-user/assign-user.module';
import { BomListComponent } from './BOM/bom-list/bom-list.component';
import { BomCreateComponent } from './BOM/bom-create/bom-create.component';
import { BomStatusComponent } from './bom-status/bom-status.component';
import { BomActionComponent } from './bom-action/bom-action.component';
import { ProductionListComponent } from './production-list/production-list.component';
import { AddNewProductionComponent } from './add-new-production/add-new-production.component';
import { ProductionStatusComponent } from './production-status/production-status.component';
import { ActionProductionComponent } from './action-production/action-production.component';
import { ScheduleProductionComponent } from './schedule-production/schedule-production.component';
import { ScheduleProductionActionComponent } from './schedule-production/schedule-production-action/schedule-production-action.component';
import { ProductionTrackingComponent } from './production-tracking/production-tracking.component';
import { TrackingActionsComponent } from './production-tracking/tracking-actions/tracking-actions.component';
import { UpdateProductionTrackingComponent } from './production-tracking/update-production-tracking/update-production-tracking.component';
import { ViewScheduledProductionComponent } from './schedule-production/view-scheduled-production/view-scheduled-production.component';
import { ProductionMaintenanceComponent } from './production-tracking/production-maintenance/production-maintenance.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ProductionTrackingChartComponent } from './production-tracking/production-tracking-chart/production-tracking-chart.component';
 

@NgModule({
  declarations: [
    ProductionComponent,
    BomListComponent,
    BomCreateComponent,
    BomStatusComponent,
    BomActionComponent,
    ProductionListComponent,
    AddNewProductionComponent,
    ProductionStatusComponent,
    ActionProductionComponent,
    ScheduleProductionComponent,
    ScheduleProductionActionComponent,
    ProductionTrackingComponent,
    TrackingActionsComponent,
    UpdateProductionTrackingComponent,
    ViewScheduledProductionComponent,
    ProductionMaintenanceComponent,
    ProductionTrackingChartComponent,
     
    
  ],
  imports: [
    CommonModule,
    ProductionRoutingModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    CKEditorModule,
    // AssignUserModule,
    AgGridModule,
    NgxMatTimepickerModule
  ]
})
export class ProductionModule { }
