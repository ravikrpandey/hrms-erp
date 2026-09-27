import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatutoryComponent } from './statutory/statutory.component';

const routes: Routes = [
  {
    path: '',
    component: StatutoryComponent,
    children: [
      {
        path: '',
        redirectTo: 'EPF',
        pathMatch: 'full',
      },
      {
        path: 'EPF',
        loadChildren: () => import('./epf/epf.module').then((m) => m.EpfModule),
      },
      {
        path: 'ESI',
        loadChildren: () => import('./esi/esi.module').then((m) => m.EsiModule),
      },
      {
        path: 'bonus',
        loadChildren: () =>
          import('./bonus/bonus.module').then((m) => m.BonusModule),
      },
      {
        path: 'pt',
        loadChildren: () => import('./pt/pt.module').then((m) => m.PtModule),
      },
      {
        path: 'lwf',
        loadChildren: () => import('./lwf/lwf.module').then((m) => m.LwfModule),
      },
      {
        path: 'gratuity_create',
        loadChildren: () => import('./gratuity/gratuity-module').then((m) => m.GratuityModule),
      },
      {
        path: 'nps',
        loadChildren: () => import('./nps/nps-module').then((m) => m.NpsModule),
      },
      {
        path: 'superannuation',
        loadChildren: () => import('./superannuation/superannuation-module').then((m) => m.SuperannuationModule),
      },
      {
        path: 'compliance-financial-year',
        loadChildren: () => import('./compliance-fy/compliance-fy-module').then((m) => m.ComplianceFyModule),
      },
      {
        path: 'tax-calculation-master',
        loadChildren: () => import('./tax-calculation-master/tax-calculation-master-module').then((m) => m.TaxCalculationMasterModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatutoryRoutingModule {}
