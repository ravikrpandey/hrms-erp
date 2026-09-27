import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PtListComponent } from './pt-list/pt-list.component';
import { PtCreateComponent } from './pt-create/pt-create.component';

const routes: Routes = [
  {path:'' , component:PtListComponent},
  {path:'pt-create', component:PtCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PtRoutingModule { }
