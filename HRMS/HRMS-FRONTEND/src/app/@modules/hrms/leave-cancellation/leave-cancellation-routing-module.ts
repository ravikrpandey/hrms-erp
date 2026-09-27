import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveCancellationAll } from './leave-cancellation-all/leave-cancellation-all';
import { LeaveCancellationList } from './leave-cancellation-list/leave-cancellation-list';

const routes: Routes = [
  {
    path:'',
    component:LeaveCancellationAll
  },
   {
    path:'leave-cancellation-list',
    component:LeaveCancellationList
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveCancellationRoutingModule { }
