import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessoryItemComponent } from './accessory-item.component';
import { AccessoryItemViewComponent } from './accessory-item-view/accessory-item-view.component';
import { AccessoryItemCreateComponent } from './accessory-item-create/accessory-item-create.component';
// import { PrItemComponent } from './pr-item.component';
// import { PrItemCreateComponent } from './pr-item-create/pr-item-create.component';
// import { PrItemViewComponent } from './pr-item-view/pr-item-view.component';

const routes: Routes = [
  { path: "", component: AccessoryItemComponent},
  { path: "create-accessory", component: AccessoryItemCreateComponent},
  { path: "view", component: AccessoryItemViewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessoryItemRoutingModule { }
