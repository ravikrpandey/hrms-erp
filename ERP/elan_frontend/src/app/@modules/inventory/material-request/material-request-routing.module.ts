import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialRequestListComponent } from './material-request-list/material-request-list.component';
import { MaterialRequestDetailsComponent } from './material-request-details/material-request-details.component';
import { MaterialAllocateComponent } from './material-allocate/material-allocate.component';


const routes: Routes = [
  {path:'', component:MaterialRequestListComponent},
  {path:'material-request-list',component:MaterialRequestListComponent},
  {path:'material-request-details',component:MaterialRequestDetailsComponent},
  {path:'material-allocate',component:MaterialAllocateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRequestRoutingModule { }
