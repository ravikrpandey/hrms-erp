import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreDashboardComponent } from './store-dashboard.component';

const routes: Routes = [
  {path:'',component:StoreDashboardComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreDashboardRoutingModule { }
