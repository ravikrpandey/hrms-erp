import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrmServiceDashboardComponent } from './crm-service-dashboard/crm-service-dashboard.component';

const routes: Routes = [
  {path:'', component:CrmServiceDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmServiceDashbardRoutingModule { }
