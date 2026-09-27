import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RejectedQuotationsComponent } from './rejected-quotations.component';

const routes: Routes = [
  
  {
    path:'',component:RejectedQuotationsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RejectedQuotationsRoutingModule { }
