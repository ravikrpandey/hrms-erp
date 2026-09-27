import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseApprovalComponent } from './course-approval.component';
import { PendingComponent } from './pending/pending.component';
import { ApprovedComponent } from './approved/approved.component';
import { RejectedComponent } from './rejected/rejected.component';

const routes: Routes = [
 {path:'',component:CourseApprovalComponent, 
     children:[
       { path: '', redirectTo: 'pending-course-approval', pathMatch: 'full' },
       {
         path: 'pending-course-approval',component : PendingComponent
       },
       {
         path :'rejected-course-approval',component : RejectedComponent
       },
       {
         path :'approved-course-approval',component : ApprovedComponent
         
       }
      
     ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseApprovalRoutingModule { }
