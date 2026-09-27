import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingQuotationsComponent } from './pending-quotations.component';

const routes: Routes = [
  
  {
    path:'',component:PendingQuotationsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingQuotationsRoutingModule { }
