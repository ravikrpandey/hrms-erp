import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceMasterListComponent } from './service-master-list/service-master-list.component';
import { ServiceMasterCreateComponent } from './service-master-create/service-master-create.component';
import { ServiceMasterActionComponent } from './service-master-action/service-master-action.component';

const routes: Routes = [
  { path: "", component: ServiceMasterListComponent},
  { path: "create", component: ServiceMasterCreateComponent},
  { path: "action", component: ServiceMasterActionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceMasterRoutingModule { }
