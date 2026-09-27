import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveEnCashmentList } from './leave-encashment-list/leave-encashment-list.component';
import { LeaveEnCashmentCreateComponent } from './leave-encashment-create/leave-encashment-create.component';
import { LeaveEnCashmentActionComponent } from './leave-encashment-action/leave-encashment-action.component';

const routes: Routes = [
  { path: "", component: LeaveEnCashmentList},
  { path: "create", component: LeaveEnCashmentCreateComponent},
  { path: "action", component: LeaveEnCashmentActionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class leaveEncashmentRoutingModule { }
