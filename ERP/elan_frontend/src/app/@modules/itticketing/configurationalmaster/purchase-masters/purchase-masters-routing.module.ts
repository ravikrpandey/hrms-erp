import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseMastersComponent } from './purchase-masters.component';

const routes: Routes = [
  { path: '', component: PurchaseMastersComponent },
  { path: 'ports', loadChildren: () => import('./port-master/port-master.module').then(m => m.PortMasterModule) },
  { path: 'incoterm', loadChildren: () => import('./incoterm-master/incoterm-master.module').then(m => m.IncotermMasterModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseMastersRoutingModule { }
