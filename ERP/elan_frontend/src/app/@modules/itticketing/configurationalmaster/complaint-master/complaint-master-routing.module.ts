import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComplaintMasterComponent } from './complaint-master.component';

const routes: Routes = [
  {
    path:'',component:ComplaintMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplaintMasterRoutingModule { }
