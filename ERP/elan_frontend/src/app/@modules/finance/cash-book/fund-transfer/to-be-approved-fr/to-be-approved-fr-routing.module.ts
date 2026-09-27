import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToBeApprovedFrComponent } from './to-be-approved-fr.component';

const routes: Routes = [
  {path:'',component:ToBeApprovedFrComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToBeApprovedFrRoutingModule { }
