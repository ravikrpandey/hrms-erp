import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceRequest } from './attendance-request';
import { AttendanceRequestList } from './attendance-request-list/attendance-request-list';
import { AttendanceRequestForm } from './attendance-request-form/attendance-request-form';

const routes: Routes = [
  {
    path: '', 
    component: AttendanceRequest,
    children: [
      {
        path: '', 
        redirectTo: 'attendance-request-list', 
        pathMatch: 'full'
      },
      {
        path: 'attendance-request-list', 
        component: AttendanceRequestList
      },
      {
        path: 'attendance-request-form', 
        component: AttendanceRequestForm
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRequestRoutingModule { }
