import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveQuota } from './leave-quota';

const routes: Routes = [
  {path:'',component:LeaveQuota}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveQuotaRoutingModule { }
