import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductMasterListComponent } from './product-master-list/product-master-list.component';
import { ProductMasterCreateComponent } from './product-master-create/product-master-create.component';
import { ProductMasterActionComponent } from './product-master-action/product-master-action.component';

const routes: Routes = [

  { path: "", component: ProductMasterListComponent},
  { path: "create", component: ProductMasterCreateComponent},
  { path: "action", component: ProductMasterActionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMasterRoutingModule { }
