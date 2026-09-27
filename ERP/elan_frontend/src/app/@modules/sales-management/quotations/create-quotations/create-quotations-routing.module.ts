import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateQuotationsComponent } from './create-quotations.component';

const routes: Routes = [
  
  {
    path:'',component:CreateQuotationsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateQuotationsRoutingModule { }
