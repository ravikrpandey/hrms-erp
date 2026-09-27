import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddChartAccountComponent } from './add-chart-account/add-chart-account.component';
import { ChartAccountComponent } from './chart-account.component';
import { ViewChartComponent } from './view-chart/view-chart.component';

const routes: Routes = [
  { path: '', component: ChartAccountComponent },
  { path: 'add-chart', component: AddChartAccountComponent },
  { path: 'view-chart', component: ViewChartComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartAccountRoutingModule { }
