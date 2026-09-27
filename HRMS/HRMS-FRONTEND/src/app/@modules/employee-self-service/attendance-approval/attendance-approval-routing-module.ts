import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceApproval } from './attendance-approval';
import { AttendanceApprovalStatus } from './attendance-approval-status/attendance-approval-status';

const routes: Routes = [{ path: '', component: AttendanceApproval,   children: [
      {
        path: '', 
        redirectTo: 'attendance-approval-status', 
        pathMatch: 'full'
      },
      {
        path: 'attendance-approval-status', 
        component: AttendanceApprovalStatus
      }
    
    ]
  }]

    

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceApprovalRoutingModule { }
