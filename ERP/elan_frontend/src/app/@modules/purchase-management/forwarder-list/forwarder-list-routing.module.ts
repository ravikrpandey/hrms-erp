import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForwarderListComponent } from './forwarder-list.component';
import { ChaForwarderFormComponent } from '../cha-forwarder-form/cha-forwarder-form.component';

const routes: Routes = [
  {
    path: '',
    component: ForwarderListComponent,
  },
  {
    path: 'forwarder-form',
    component: ChaForwarderFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForwarderListRoutingModule {}
