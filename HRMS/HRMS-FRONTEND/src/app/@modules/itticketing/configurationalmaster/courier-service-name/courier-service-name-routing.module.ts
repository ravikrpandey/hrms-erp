import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourierServiceNameModule } from './courier-service-name.module';
import { CourierServiceNameComponent } from './courier-service-name.component';

const routes: Routes = [
  { path: "", component: CourierServiceNameComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourierServiceNameRoutingModule { }
