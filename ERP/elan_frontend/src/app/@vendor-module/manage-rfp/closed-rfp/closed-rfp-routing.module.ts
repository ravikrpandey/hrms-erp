import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClosedRfpComponent } from './closed-rfp.component';

const routes: Routes = [
  {path:'',component:ClosedRfpComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClosedRfpRoutingModule { }
