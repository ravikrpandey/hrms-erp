import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EarningsListComponent } from './earnings-list/earnings-list.component';
import { EarningsCreateComponent } from './earnings-create/earnings-create.component';

const routes: Routes = [
  {path:'', component:EarningsListComponent},
  {path:'earning-create', component:EarningsCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EarningsRoutingModule { }
