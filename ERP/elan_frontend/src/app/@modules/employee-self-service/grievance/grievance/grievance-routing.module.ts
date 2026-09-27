import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrievanceCreateComponent } from './grievance-create/grievance-create.component';
import { GrievanceListComponent } from './grievance-list/grievance-list.component';

const routes: Routes = [
  {path:'',component:GrievanceListComponent},
  {path:'grievance_create', component:GrievanceCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrievanceRoutingModule { }
