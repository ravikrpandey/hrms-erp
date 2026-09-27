import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';;
import { ShiftMasterModule } from './shift-master.module';
import { ShiftListComponent } from './shift-list/shift-list.component';
import { ShiftCreateComponent } from './shift-create/shift-create.component';

const routes: Routes = [
  {
    path:'',component:ShiftListComponent
  },
  {
    path:"create",component:ShiftCreateComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftMasterRouting { }