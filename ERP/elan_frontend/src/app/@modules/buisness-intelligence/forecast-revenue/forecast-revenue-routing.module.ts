import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForecastRevenueListComponent } from './forecast-revenue-list/forecast-revenue-list.component';
import { ForecastRevenueCreateComponent } from './forecast-revenue-create/forecast-revenue-create.component';
import { ForecastRevenueComponent } from './forecast-revenue.component';

const routes: Routes = [
  {path:'',component:ForecastRevenueComponent},
  {path:'list',component:ForecastRevenueListComponent},
  {path:'create',component:ForecastRevenueCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForecastRevenueRoutingModule { }
