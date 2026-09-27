import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleRegistrationListComponent } from './vehicle-registration-list/vehicle-registration-list.component';
import { VehicleRegistrationCreateComponent } from './vehicle-registration-create/vehicle-registration-create.component';
import { VehicleRegistrationActionComponent } from './vehicle-registration-action/vehicle-registration-action.component';

const routes: Routes = [

  { path: "", component: VehicleRegistrationListComponent},
  { path: "create", component: VehicleRegistrationCreateComponent},
  { path: "action", component: VehicleRegistrationActionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMasterRoutingModule { }
