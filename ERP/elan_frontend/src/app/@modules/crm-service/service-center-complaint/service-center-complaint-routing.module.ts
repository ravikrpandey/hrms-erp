import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceCenterComplaintComponent } from './service-center-complaint/service-center-complaint.component';
import { MaterialRequestComponent } from './material-request/material-request.component';

const routes: Routes = [
  {path:'', component:ServiceCenterComplaintComponent},
  {path:'material-request',component:MaterialRequestComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceCenterComplaintRoutingModule { }
