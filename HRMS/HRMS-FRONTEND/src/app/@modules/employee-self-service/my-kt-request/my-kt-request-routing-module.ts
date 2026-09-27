import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyKtRequest } from './my-kt-request/my-kt-request';

const routes: Routes = [
  {path:'',component:MyKtRequest}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyKtRequestRoutingModule { }
