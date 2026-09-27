import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionComponent } from './production.component';
import { BomListComponent } from './BOM/bom-list/bom-list.component';
import { BomCreateComponent } from './BOM/bom-create/bom-create.component';
import { ProductionListComponent } from './production-list/production-list.component';
import { AddNewProductionComponent } from './add-new-production/add-new-production.component';
import { ScheduleProductionComponent } from './schedule-production/schedule-production.component';
import { ProductionTrackingComponent } from './production-tracking/production-tracking.component';
import { UpdateProductionTrackingComponent } from './production-tracking/update-production-tracking/update-production-tracking.component';
import { ViewScheduledProductionComponent } from './schedule-production/view-scheduled-production/view-scheduled-production.component';
import { ProductionMaintenanceComponent } from './production-tracking/production-maintenance/production-maintenance.component';
import { ProductionTrackingChartComponent } from './production-tracking/production-tracking-chart/production-tracking-chart.component';

const routes: Routes = [
  
  {path:'', component:ProductionComponent,
  children: [
    {
      path: 'bom',
      component: BomListComponent
    },
     {path:'bom-create', component:BomCreateComponent},
     { path: 'production-list', component:ProductionListComponent },
  { path:'add-new-production', component:AddNewProductionComponent},
  {
    path:'schedule-production',component:ScheduleProductionComponent
  },
  {
    path:'production-tracking-list',component:ProductionTrackingComponent
  },
  {
    path:'edit-production-tracking',component:UpdateProductionTrackingComponent
  },
  {
    path:'view-scheduled-production',component:ViewScheduledProductionComponent
  },
  {
    path:'production-maintenance',component:ProductionMaintenanceComponent
  },
  {
    path:'production-tracking-chart',component:ProductionTrackingChartComponent
  }
  ]
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
