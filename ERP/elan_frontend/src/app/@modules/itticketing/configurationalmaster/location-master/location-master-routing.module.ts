import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationMasterComponent } from './location-master.component';
import { LocationMasterCreateComponent } from './location-master-create/location-master-create.component';

const routes: Routes = [
  { path: '', component: LocationMasterComponent },
  { path: 'create_location', component: LocationMasterCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationMasterRoutingModule { }
