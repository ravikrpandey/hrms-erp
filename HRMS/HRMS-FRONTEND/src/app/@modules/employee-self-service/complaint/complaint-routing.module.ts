import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComplaintCreateComponent } from './complaint-create/complaint-create.component';
import { ComplaintListComponent } from './complaint-list/complaint-list.component';
import { AssignedComplaintComponent } from './assigned-complaint/assigned-complaint.component';
import { AgainstComplaintComponent } from './against-complaint/against-complaint.component';

const routes: Routes = [
  {path:'complaint-create',component:ComplaintCreateComponent},
  {path:'',component:ComplaintListComponent},
  {path:'assigned-complaint',component:AssignedComplaintComponent},
  {path:'against-complaint',component:AgainstComplaintComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplaintRoutingModule { }
