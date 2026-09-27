import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrItemComponent } from './pr-item.component';
import { PrItemCreateComponent } from './pr-item-create/pr-item-create.component';
import { PrItemViewComponent } from './pr-item-view/pr-item-view.component';

const routes: Routes = [
  { path: "", component: PrItemComponent},
  { path: "create-item", component: PrItemCreateComponent},
  { path: "view", component: PrItemViewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrItemRoutingModule { }
