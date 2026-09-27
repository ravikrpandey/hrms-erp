import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Superannuation } from './superannuation/superannuation';

const routes: Routes = [
  {path:'',component:Superannuation}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperannuationRoutingModule { }
