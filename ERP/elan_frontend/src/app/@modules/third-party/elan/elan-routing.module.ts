import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElanComponent } from './elan.component';

const routes: Routes = [
  {
    path: '',
    component: ElanComponent,
    children: [
      {
        path: 'org-setup',
        loadChildren: () =>
          import('./org-setup/org-setup.module').then((m) => m.OrgSetupModule),
      },
      {
        path: 'org-type-master',
        loadChildren: () =>
          import('./org-type-master/org-type-master.module').then(
            (m) => m.OrgTypeMasterModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElanRoutingModule {}
