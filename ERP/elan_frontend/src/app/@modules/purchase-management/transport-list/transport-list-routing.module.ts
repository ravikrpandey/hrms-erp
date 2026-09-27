import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChaForwarderFormComponent } from '../cha-forwarder-form/cha-forwarder-form.component';
import { TransportListComponent } from './transport-list.component';

const routes: Routes = [
  {
    path: '',
    component: TransportListComponent,
  },
  {
    path: 'transport-form',
    component: ChaForwarderFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransportListRoutingModule {}
