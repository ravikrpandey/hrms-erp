import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page.component';

const routes: Routes = [
  {
    path: '', component: DashboardPageComponent,
    // children: [
    //   {
    //     path: 'component-name',
    //     component: ComponentNameComponent
    //   },
    // ]
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardPageRoutingModule { }
