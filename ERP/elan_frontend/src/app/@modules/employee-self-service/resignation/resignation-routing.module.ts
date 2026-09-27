import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { MyRequestCreateComponent } from './my-request-manpower/my-request-create/my-request-create.component';
import { AgGridModule } from 'ag-grid-angular';
import { ApplyResignationComponent } from './apply-resignation/apply-resignation.component';
import { ResignationComponent } from './resignation.component';
import { ApprovedByMeComponent } from './approved-by-me/approved-by-me.component';
import { RejectComponent } from './reject/reject.component';
import { MyListCreateComponent } from './my-list-resignation/my-list-create/my-list-create.component';
import { ListFormComponent } from './pending-for-approval/list-form/list-form.component';
// import { ApprovalComponent } from './approval/approval.component';
// import { RejectComponent } from './reject/reject.component';

const routes: Routes = [
  {path:'',component:ResignationComponent, 
   children:[
    {path:'', redirectTo:'my-request-resignation',pathMatch:'full'},
    {
      path: 'my-request-resignation',
      loadChildren: () =>
        import('./my-list-resignation/my-list-resignation.module').then(
          (m) => m.MyListResignationModule
        ),
    },
    {
      path: 'pending-for-approval',
      loadChildren: () =>
        import('./pending-for-approval/pending-for-approval.module').then(
          (m) => m.PendingForApprovalModule
        ),
    },
    {path:'approval',component:ApprovedByMeComponent},
      
    {path:'reject',component:RejectComponent},

    {path:'update',component:ListFormComponent},

    
   ]
},
{path:'new-request-create',component:MyListCreateComponent}

  // {path:'',redirectTo:'manpower_req_main', pathMatch:'full'}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResignationRoutingModule { }
