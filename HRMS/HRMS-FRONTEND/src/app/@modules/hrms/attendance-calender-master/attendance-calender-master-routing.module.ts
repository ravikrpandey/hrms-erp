import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceCalenderTableComponent } from './attendance-calender-table/attendance-calender-table.component';

const routes: Routes = [
  {path:'',component:AttendanceCalenderTableComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttandanceCalenderRoutingModule { }
