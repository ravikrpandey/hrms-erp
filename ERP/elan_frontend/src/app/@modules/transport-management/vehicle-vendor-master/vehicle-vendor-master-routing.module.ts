import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleVendorMasterListComponent } from './vehicle-vendor-master-list/vehicle-vendor-master-list.component';
import { VehicleVendorMasterCreateComponent } from './vehicle-vendor-master-create/vehicle-vendor-master-create.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleVendorMasterListComponent

  },
   {
      path: 'add-vehicle-vendor-master',
      component:VehicleVendorMasterCreateComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleVendorMasterRoutingModule { }
