import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelRequestListComponent } from './travelrequestlist.component';
import { AddTravelRequestComponent } from './add-travel-request/add-travel-request.component';

const routes: Routes = [
  {path:'', redirectTo:'travel-request-list',pathMatch:'full'},
  { path: 'travel-request-list', component: TravelRequestListComponent },
  { path: 'create-travel-request', component: AddTravelRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelRequestRoutingModule { }
