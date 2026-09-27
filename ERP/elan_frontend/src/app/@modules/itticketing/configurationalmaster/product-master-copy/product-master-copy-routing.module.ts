import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductMasterCopyComponent } from './product-master-copy/product-master-copy.component';

const routes: Routes = [
  {path:"",component:ProductMasterCopyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMasterCopyRoutingModule { }
