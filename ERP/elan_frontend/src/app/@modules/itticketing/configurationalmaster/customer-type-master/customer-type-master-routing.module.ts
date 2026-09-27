import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerTypeMasterComponent } from './customer-type-master.component';

const routes: Routes = [
  {path:'',component:CustomerTypeMasterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerTypeMasterRoutingModule { }
