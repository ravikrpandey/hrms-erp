import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QualityManagementComponent } from './quality-management.component';
import { QualityCheckComponent } from './quality-check/quality-check.component';
import { QualityControlComponent } from './quality-control/quality-control.component';
import { UpdateQuantityCheckComponent } from './quality-check/update-quantity-check/update-quantity-check.component';
import { QuantityCheckChartComponent } from './quality-check/quantity-check-chart/quantity-check-chart.component';
import { PlantSampleListComponent } from './quality-control/quality-control-action/plant-sample-list/plant-sample-list.component';
import { AddSampleComponent } from './quality-control/quality-control-action/add-sample/add-sample.component';

const routes: Routes = [{ path: '', component: QualityManagementComponent ,
  children:[
      {path:'quality-check',component:QualityCheckComponent},
      {path:'quality-control' , component:QualityControlComponent},
      {path:'update-quality-check',component:UpdateQuantityCheckComponent},
      {path:'view-quality-chart',component:QuantityCheckChartComponent},
      {path:'plant-sample-list',component:PlantSampleListComponent},
      {path:'add-sample',component:AddSampleComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityManagementRoutingModule { }
