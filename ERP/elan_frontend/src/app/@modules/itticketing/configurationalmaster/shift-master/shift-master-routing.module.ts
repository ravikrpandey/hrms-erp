import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftMasterListComponent } from './shift-master-list/shift-master-list.component';
import { ShiftMasterCreateComponent } from './shift-master-create/shift-master-create.component';

const routes: Routes = [
  {path: '', component: ShiftMasterListComponent},
  {path: 'create', component: ShiftMasterCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftMasterRoutingModule { }
