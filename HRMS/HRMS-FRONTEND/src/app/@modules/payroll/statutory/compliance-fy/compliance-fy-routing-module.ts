import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Compliance } from './compliance/compliance';

const routes: Routes = [
  {path:'',component:Compliance}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplianceFyRoutingModule { }
