import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyResignationListComponent } from './my-resignation-list/my-resignation-list.component';
import { ApprovedByMeComponent } from '../approved-by-me/approved-by-me.component';
import { MyListCreateComponent } from './my-list-create/my-list-create.component';
// import { MyRequestListComponent } from './my-request-list/my-request-list.component';
// // import { MyRequestCreateComponent } from './my-request-create/my-request-create.component';
// import { ApprovalComponent } from '../approval/approval.component';

const routes: Routes = [
  {path:'',component:MyResignationListComponent},
  {path:'',component:ApprovedByMeComponent},
  {path:'new-resignation-request',component:MyListCreateComponent}
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyListResignationRoutingModule { }
