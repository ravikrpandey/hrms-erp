import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RbacRoleMasterModule } from './rbac-role-master/rbac-role-master.module';
import { RbacmasterComponent } from './rbacmaster.component';

const routes: Routes = [
  {
    path: '',
    component: RbacmasterComponent,
  },
  {
    path: 'rbac-role-master',
    loadChildren: () =>
      import('./rbac-role-master/rbac-role-master.module').then(
        (m) => m.RbacRoleMasterModule
      ),
  },
  {
    path: 'user-master',
    loadChildren: () =>
      import('./usermaster/usermaster.module').then((m) => m.UsermasterModule),
  },
  {
    path: 'role-assign-admin-user',
    loadChildren: () =>
      import('./role-assign/role-assign.module').then(
        (m) => m.RoleAssignModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RbacmasterRoutingModule {}
