import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'list-acc-subtypes',
    loadChildren: () =>
      import('./subtype/subtype.module').then((m) => m.SubtypeModule),
  },
  // {
  //   path: 'account-charts',
  //   loadChildren: () =>
  //     import('./chart-account/chart-account.module').then((m) => m.ChartAccountModule),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSubtypeRoutingModule { }
