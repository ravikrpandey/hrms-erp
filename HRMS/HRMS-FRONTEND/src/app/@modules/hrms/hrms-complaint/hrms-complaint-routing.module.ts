import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrmsComplaintComponent } from './hrms-complaint.component';

const routes: Routes = [
  {path:'',component:HrmsComplaintComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmsComplaintRoutingModule { }
