import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasketMasterComponent } from './basket-master.component';
import { BasketMasterCreateComponent } from './basket-master-create/basket-master-create.component';
// import { LocationMasterComponent } from './basket-master.component';

const routes: Routes = [
  { path: '', component: BasketMasterComponent },
  { path: 'create_basket', component: BasketMasterCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasketMasterRoutingModule { }
