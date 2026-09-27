import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardMainComponent } from './dashboard-main.component';
import { SuperDashboardComponent } from './super-dashboard/super-dashboard.component';
// import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';

const routes: Routes = [
  {path:'',component:DashboardMainComponent , 
children:[
{path:"super-dashboard",component:SuperDashboardComponent}
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardMainRoutingModule { }
