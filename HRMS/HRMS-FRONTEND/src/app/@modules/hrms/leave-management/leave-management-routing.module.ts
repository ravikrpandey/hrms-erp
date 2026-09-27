import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveMasterComponent } from './leave-master/leave-master.component';



const routes: Routes = [
  {path:'leave-master',component:LeaveMasterComponent},
  // {path:'leave-policy',component:LeavePolicyComponent},
  {
    path: 'leave-policy',
    loadChildren: () =>
      import('./leave-policy/leave-policy.module').then((m) => m.LeavePolicyModule),
  },
  {
    path:'leave-quota',
    loadChildren:()=>
      import('./leave-quota/leave-quota-module').then((m)=> m.LeaveQuotaModule)
  }
];









@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})



export class LeaveManagementRoutingModule { }