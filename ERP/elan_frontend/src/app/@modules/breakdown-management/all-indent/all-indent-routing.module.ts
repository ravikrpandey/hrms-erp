import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllIndentComponent } from './all-indent/all-indent.component';

const routes: Routes = [
  {path:'',component:AllIndentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllIndentRoutingModule { }
