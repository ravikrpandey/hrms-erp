import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicalCategoryComponent } from './vehical-category.component';

const routes: Routes = [
  {path:'',component:VehicalCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicalCategoryRoutingModule { }
