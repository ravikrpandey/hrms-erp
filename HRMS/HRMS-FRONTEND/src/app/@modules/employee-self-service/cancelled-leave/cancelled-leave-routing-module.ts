import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CancelledLeave } from './cancelled-leave/cancelled-leave';

const routes: Routes = [
   {path:'',component:CancelledLeave},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancelledLeaveRoutingModule { }
