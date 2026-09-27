import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployementTypeComponent } from './employement-type.component';

const routes: Routes = [{ path: '', component: EmployementTypeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployementTypeRoutingModule { }
