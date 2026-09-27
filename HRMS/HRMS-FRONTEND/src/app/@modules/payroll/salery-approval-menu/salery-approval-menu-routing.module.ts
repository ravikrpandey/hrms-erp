import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingApprovalSaleryComponent } from './pending-approval-salery/pending-approval-salery.component';
import { SaleryApproverMainComponent } from './salery-approver-main.component';
import { SaleryApproverComponent } from './salery-approver/salery-approver.component';
import { SaleryRejectComponent } from './salery-reject/salery-reject.component';
import { SaleryPendingListComponent } from './salery-pending-list/salery-pending-list.component';
import { ApprovedSaleryProcessListComponent } from './approved-salery-process-list/approved-salery-process-list.component';
import { RejectEmployessComponent } from './reject-employess/reject-employess.component';

const routes: Routes = [
  {path:"",component:SaleryApproverMainComponent,
children:[
  {path:"",redirectTo:"pending-approver",pathMatch:'full'},
  {path:'pending-approver',component:PendingApprovalSaleryComponent},
  {path:'reject-approver',component:SaleryRejectComponent},
  {path:'process-salery',component:ApprovedSaleryProcessListComponent}
]
},
{path:'salery-approver',component:SaleryApproverComponent},

{path:"salery-pending-list",component:SaleryPendingListComponent},
{path:"reject-employe",component:RejectEmployessComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleryApprovalMenuRoutingModule { }
