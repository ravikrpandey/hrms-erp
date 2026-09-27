import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Gratuitycreate } from './gratuitycreate/gratuitycreate';

const routes: Routes = [
  {path:'', component:Gratuitycreate}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GratuityRoutingModule { }
