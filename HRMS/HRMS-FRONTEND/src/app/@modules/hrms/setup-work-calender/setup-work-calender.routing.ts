import { Routes, RouterModule } from '@angular/router';
import { SetupWorkCalenderTableComponent } from './setup-work-calender-table/setup-work-calender-table.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path:'',redirectTo:"setup-work-calendar",pathMatch:'full',
  },
  {
    path:"setup-work-calendar",component:SetupWorkCalenderTableComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupWorkCalenderRouting {}
