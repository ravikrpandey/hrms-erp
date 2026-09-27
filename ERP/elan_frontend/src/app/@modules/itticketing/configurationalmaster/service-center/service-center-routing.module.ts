import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceCenterComponent } from './service-center.component';
import { ServiceCenterCreateComponent } from './service-center-create/service-center-create.component';

const routes: Routes = [ 
  { path: '', component: ServiceCenterComponent},
  { path: 'create', component: ServiceCenterCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceCenterRoutingModule { }
