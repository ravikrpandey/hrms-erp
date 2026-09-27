import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclePlanningComponent } from './vehicle-planning.component';
import { CreateVehiclePlanningComponent } from './create-vehicle-planning/create-vehicle-planning.component';

const routes: Routes = [
  { path: '', component: VehiclePlanningComponent },
  {path: 'add', component: CreateVehiclePlanningComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclePlanningRoutingModule { }
