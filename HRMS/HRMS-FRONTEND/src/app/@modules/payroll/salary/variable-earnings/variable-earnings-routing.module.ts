import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VariableEarningsListComponent } from './variable-earnings-list/variable-earnings-list.component';
import { VariableEarningsCreateComponent } from './variable-earnings-create/variable-earnings-create.component';

const routes: Routes = [
  {path:'', component:VariableEarningsListComponent},
  {path:'create-variable-earnings', component:VariableEarningsCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariableEarningsRoutingModule { }
