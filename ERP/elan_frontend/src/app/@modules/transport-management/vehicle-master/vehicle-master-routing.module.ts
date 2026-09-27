import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateVehicleMasterComponent } from './create-vehicle-master/create-vehicle-master.component';
import { VehicleMasterComponent } from './vehicle-master.component';

const routes: Routes = [
  {path:'',component:VehicleMasterComponent},
  {path:'create-vehicle',component:CreateVehicleMasterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleMasterRoutingModule { }
