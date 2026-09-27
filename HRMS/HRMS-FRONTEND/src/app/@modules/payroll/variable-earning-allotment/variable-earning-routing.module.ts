import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VariableEarningListComponent } from './variable-earning-list/variable-earning-list.component';
import { VariableEarningCreateComponent } from './variable-earning-create/variable-earning-create.component';

const routes: Routes = [
  {path:'', component:VariableEarningListComponent},
  {path:'create-template',component:VariableEarningCreateComponent},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariableEarningRoutingModule { }
