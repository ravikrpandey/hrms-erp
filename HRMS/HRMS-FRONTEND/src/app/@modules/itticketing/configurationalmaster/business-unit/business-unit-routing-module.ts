import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessUnit } from './business-unit';

const routes: Routes = [
  { path: "", component: BusinessUnit  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessUnitRoutingModule { }
