import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceCategoryComponent } from './service-category.component';

const routes: Routes = [
  { path: "", component: ServiceCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicegoryRoutingModule { }