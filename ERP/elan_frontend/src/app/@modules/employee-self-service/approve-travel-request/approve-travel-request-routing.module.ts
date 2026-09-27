import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproveTravelRequestComponent } from './approve-travel-request.component';


const routes: Routes = [
  {path:'', redirectTo:'travel-request-approval-list',pathMatch:'full'},
  { path: 'travel-request-approval-list', component: ApproveTravelRequestComponent },
  // { path: 'create-travel-request', component: AddTravelRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprroveTravelRequestRoutingModule { }
