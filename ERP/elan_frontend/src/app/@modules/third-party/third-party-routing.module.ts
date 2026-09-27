import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThirdPartyComponent } from './third-party.component';

const routes: Routes = [
  {
    path: '',
    component: ThirdPartyComponent,
    children: [
      {
        path: 'elan',
        loadChildren: () =>
          import('./elan/elan.module').then((m) => m.ElanModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThirdPartyRoutingModule {}
