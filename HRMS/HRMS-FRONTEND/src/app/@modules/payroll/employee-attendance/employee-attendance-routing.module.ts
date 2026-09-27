import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeAttendanceListComponent } from './employee-attendance-list/employee-attendance-list.component';
import { EmployeeAttendanceDetailComponent } from './employee-attendance-detail/employee-attendance-detail.component';

const routes: Routes = [
  {
    path: '', component: EmployeeAttendanceListComponent,
  },
  {
    path: 'employee-attendance-detail', component: EmployeeAttendanceDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeAttendanceRoutingModule { }
