import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorTypeComponent } from './vendor-type.component';

const routes: Routes = [
  {path:'', component:VendorTypeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorTypeRoutingModule { }
