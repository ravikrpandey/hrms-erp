import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourierContainComponent } from './courier-contain.component';

const routes: Routes = [
  { path: "", component: CourierContainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourierContainRoutingModule { }
