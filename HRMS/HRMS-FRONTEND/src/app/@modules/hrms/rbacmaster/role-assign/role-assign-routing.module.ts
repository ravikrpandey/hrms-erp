import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleAssignAdminUserComponent } from './role-assign-admin-user/role-assign-admin-user.component';

const routes: Routes = [
  {path:'',component:RoleAssignAdminUserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleAssignRoutingModule { }
