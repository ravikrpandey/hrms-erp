import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessAllowanceComponent } from './process-allowance/process-allowance.component';

const routes: Routes = [
    {path:'',component:ProcessAllowanceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessAllowanceRoutingModule { }
