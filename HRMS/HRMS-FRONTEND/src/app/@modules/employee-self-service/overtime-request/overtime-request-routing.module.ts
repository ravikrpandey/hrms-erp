import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OvertimeRequestListComponent } from './overtime-request-list/overtime-request-list.component';
import { CreateRequestComponent } from './create-request/create-request.component';

const routes: Routes = [
  {path:'',component:OvertimeRequestListComponent},
  {path:'create-request',component:CreateRequestComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OvertimeRequestRoutingModule { }
