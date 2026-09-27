import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimesheetCreateComponent } from './timesheet-create/timesheet-create.component';
import { TimesheetListComponent } from './timesheet-list/timesheet-list.component';

const routes: Routes = [
  {path:'timesheet-list', component: TimesheetListComponent},
  {path:'timesheet-create', component: TimesheetCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }
