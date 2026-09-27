import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrmsComponent } from './hrms.component';

const routes: Routes = [
  {
    path: '',
    component: HrmsComponent,
    children: [
      {
        path: 'employee-master',
        loadChildren: () =>
          import('./employee-master/employee-master.module').then(
            (m) => m.EmployeeMasterModule
          ),
      },
      {
        path: 'rbacmaster',
        loadChildren: () =>
          import('./rbacmaster/rbacmaster.module').then(
            (m) => m.RbacmasterModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrmsRoutingModule {}

