import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimesheetCreateComponent } from './timesheet-create/timesheet-create.component';
import { TimesheetListComponent } from './timesheet-list/timesheet-list.component';
import { MyTimesheetComponent } from './my-timesheet/my-timesheet.component';
import { CreateTimesheetComponent } from './my-timesheet/create-timesheet/create-timesheet.component';

const routes: Routes = [
  {path:'timesheet-list', component: TimesheetListComponent},
  {path:'timesheet-create', component: TimesheetCreateComponent},
  {path: 'my-timesheet', component: MyTimesheetComponent},
  {path: 'create-timesheet', component: CreateTimesheetComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }
