import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TdsListComponent } from './tds-list/tds-list.component';
import { AddTdsComponent } from './add-tds/add-tds.component';

const routes: Routes = [
  {
    path:'',component:TdsListComponent
  },
  {
    path:'add-tds-section',component:AddTdsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TdsMasterRoutingModule { }
