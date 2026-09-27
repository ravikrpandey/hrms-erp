import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllFrComponent } from './all-fr.component';

const routes: Routes = [
  {path:'',component:AllFrComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllFrRoutingModule { }
