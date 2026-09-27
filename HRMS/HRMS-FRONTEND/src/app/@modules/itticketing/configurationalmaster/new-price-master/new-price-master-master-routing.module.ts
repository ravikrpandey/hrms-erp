import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPriceMasterComponent } from './new-price-master.component';

const routes: Routes = [{ path: '', component: NewPriceMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewPriceMasterRoutingModule { }
