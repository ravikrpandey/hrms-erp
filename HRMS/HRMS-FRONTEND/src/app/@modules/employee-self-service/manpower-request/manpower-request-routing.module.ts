import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManpowerRequestComponent } from './manpower-request.component';
import { MyRequestCreateComponent } from './my-request-manpower/my-request-create/my-request-create.component';
import { AgGridModule } from 'ag-grid-angular';
import { ApprovalComponent } from './approval/approval.component';
import { RejectComponent } from './reject/reject.component';

const routes: Routes = [
  {path:'',component:ManpowerRequestComponent, 
   children:[
    {path:'', redirectTo:'my-request-manpower',pathMatch:'full'},
    {
      path: 'my-request-manpower',
      loadChildren: () =>
        import('./my-request-manpower/my-request-manpower.module').then(
          (m) => m.MyRequestManpowerModule
        ),
    },
    {
      path: 'pending-for-approval',
      loadChildren: () =>
        import('./pending-for-approval/pending-for-approval.module').then(
          (m) => m.PendingForApprovalModule
        ),
    },
    {path:'approval',component:ApprovalComponent},
      
    {path:'reject',component:RejectComponent}
    
   ]
},
{path:'new-request-create',component:MyRequestCreateComponent}

  // {path:'',redirectTo:'manpower_req_main', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManpowerRequestRoutingModule { }
