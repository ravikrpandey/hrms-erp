import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportChargeMasterComponent } from './transport-charge-master.component';
import { CreateTransportChargeComponent } from './create-transport-charge/create-transport-charge.component';

const routes: Routes = [
  {
    path:'',component:TransportChargeMasterComponent
  },
  {
    path:'create-charge',component:CreateTransportChargeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportChargeMasterRoutingModule { }
