import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSalesReturnComponent } from './create-sales-return/create-sales-return.component';
import { SalesReturnComponent } from './sales-return.component';
import { CreateSoReturnComponent } from './create-so-return/create-so-return.component';
import { ViewReturnComponent } from './view-return/view-return.component';

const routes: Routes = [
  {path:"",component:SalesReturnComponent},
  {path:"create-sales-return",component:CreateSalesReturnComponent},
  {path:"create-so-return",component:CreateSoReturnComponent},
  {path:"view-sales-return",component:ViewReturnComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesReturnRoutingModule { }
