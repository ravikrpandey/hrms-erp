import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovedQuotationsComponent } from './approved-quotations.component';

const routes: Routes = [
  
  {
    path:'',component:ApprovedQuotationsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovedQuotationsRoutingModule { }
