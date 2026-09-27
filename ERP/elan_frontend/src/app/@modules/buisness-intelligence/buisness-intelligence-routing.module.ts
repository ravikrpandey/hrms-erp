import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuisnessIntelligenceComponent } from './buisness-intelligence.component';

const routes: Routes = [
  {
    path: '',
    component: BuisnessIntelligenceComponent,
    children: [
      {
        path: 'revenue-forecasting',
        loadChildren: () =>
          import('./forecast-revenue/forecast-revenue.module').then(
            (m) => m.ForecastRevenueModule
          ),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuisnessIntelligenceRoutingModule { }
