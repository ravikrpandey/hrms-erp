import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignedIndentComponent } from './assigned-indent/assigned-indent.component';

const routes: Routes = [
  {path:'',component:AssignedIndentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignedIndentRoutingModule { }
