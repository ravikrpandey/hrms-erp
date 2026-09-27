import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatutoryComponent } from './statutory/statutory.component';

const routes: Routes = [
  {path:'',component:StatutoryComponent,
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
        loadChildren: () => import('./bonus/bonus.module').then((m) => m.BonusModule),
      },
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatutoryRoutingModule { }
