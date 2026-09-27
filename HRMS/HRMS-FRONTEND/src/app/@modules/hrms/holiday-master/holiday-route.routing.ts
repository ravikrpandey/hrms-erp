import { Routes, RouterModule } from '@angular/router';
import { HolidayListComponent } from './holiday-list/holiday-list.component';
import { NgModule } from '@angular/core';
import { HolidayCreateComponent } from './holiday-create/holiday-create.component';

const routes: Routes = [
  {
    path:'',component:HolidayListComponent
  },
  {
    path:"create",component:HolidayCreateComponent

  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayRouteRouting { }
