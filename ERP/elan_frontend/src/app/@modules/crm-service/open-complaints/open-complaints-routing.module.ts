import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenComplaintsComponent } from './open-complaints.component';
import { AssignCenterAddComponent } from './assign-center-add/assign-center-add.component';
import { ComplainDetailsComponent } from './complain-details/complain-details.component';

const routes: Routes = [
  { path: '', component: OpenComplaintsComponent },
  { path: 'assign-center-add', component: AssignCenterAddComponent },
  { path: 'complain-details', component: ComplainDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenComplaintsRoutingModule { }
