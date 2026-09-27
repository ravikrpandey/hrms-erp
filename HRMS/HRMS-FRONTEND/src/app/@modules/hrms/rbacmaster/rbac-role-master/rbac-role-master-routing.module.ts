import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RbacRoleCreateComponent } from './rbac-role-create/rbac-role-create.component';
import { RbacRoleListComponent } from './rbac-role-list/rbac-role-list.component';

const routes: Routes = [
  {
    path:'',component:RbacRoleListComponent
  },
  {
    path:'Rbac-role-create',component:RbacRoleCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RbacRoleMasterRoutingModule { }
