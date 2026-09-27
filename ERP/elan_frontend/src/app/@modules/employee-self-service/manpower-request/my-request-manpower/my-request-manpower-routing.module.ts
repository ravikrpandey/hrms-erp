import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyRequestListComponent } from './my-request-list/my-request-list.component';
import { MyRequestCreateComponent } from './my-request-create/my-request-create.component';
import { ApprovalComponent } from '../approval/approval.component';

const routes: Routes = [
  {path:'',component:MyRequestListComponent},
  {path:'',component:ApprovalComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyRequestManpowerRoutingModule { }
