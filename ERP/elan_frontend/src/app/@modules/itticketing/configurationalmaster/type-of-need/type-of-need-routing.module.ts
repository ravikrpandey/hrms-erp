import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeOfNeedComponent } from './type-of-need.component';

const routes: Routes = [{ path: '', component: TypeOfNeedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeOfNeedRoutingModule { }
