import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreakdownManagementComponent } from './breakdown-management/breakdown-management.component';

const routes: Routes = [
  {path:'',component:BreakdownManagementComponent,
    children:[
      {
        path:'breakdown-indent',
        loadChildren:()=>import('./breakdown-indent/breakdown-indent.module').then(m=>m.BreakdownIndentModule)
      },
      {
        path:'all-indent',
        loadChildren:()=>import('./all-indent/all-indent.module').then(m=>m.AllIndentModule)
      },
      {
        path:'assigned-indent',
        loadChildren:()=>import('./assigned-indent/assigned-indent.module').then(m=>m.AssignedIndentModule)
      },
      {
        path:'dashboard',
        loadChildren:()=>import('./dashboard/dashboard.module').then(m=>m.DashboardModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BreakdownManagementRoutingModule { }
