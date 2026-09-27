import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreakdownIndentComponent } from './breakdown-indent.component';
import { CreateBreakdownIndentComponent } from './create-breakdown-indent/create-breakdown-indent.component';

const routes: Routes = [
  {path:'',component:BreakdownIndentComponent},
  {path:'create-breakdown',component:CreateBreakdownIndentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BreakdownIndentRoutingModule { }
