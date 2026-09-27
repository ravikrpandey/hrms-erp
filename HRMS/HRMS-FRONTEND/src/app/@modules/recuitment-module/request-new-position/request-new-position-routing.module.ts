import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestNewPositionCreateComponent } from './request-new-position-create/request-new-position-create.component';
import { RequestNewPositionComponent } from './request-new-position.component';

const routes: Routes = [
  {path:'', component: RequestNewPositionCreateComponent},
  { path: 'request-new-position', component: RequestNewPositionCreateComponent },
  // { path: 'create', component: RequestNewPositionCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestNewPositionRoutingModule { }
