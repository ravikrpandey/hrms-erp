import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepreciationForecastComponent } from './depreciation-forecast.component';
import { DepreciationForecastListComponent } from './depreciation-forecast-list/depreciation-forecast-list.component';
import { DepreciationForecastActionComponent } from './depreciation-forecast-action/depreciation-forecast-action.component';
import { DepreciationForecastCreateComponent } from './depreciation-forecast-create/depreciation-forecast-create.component';

const routes: Routes = [
  {path:'',component:DepreciationForecastListComponent},
  {path:'list',component:DepreciationForecastListComponent},
  {path:'create',component:DepreciationForecastCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepreciationForecastRoutingModule { }
