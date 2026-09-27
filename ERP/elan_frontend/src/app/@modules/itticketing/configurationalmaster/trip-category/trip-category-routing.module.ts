import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripCategoryComponent } from './trip-category.component';

const routes: Routes = [{ path: '', component: TripCategoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripCategoryRoutingModule { }
