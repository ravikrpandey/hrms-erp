import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChaForwarderFormComponent } from '../cha-forwarder-form/cha-forwarder-form.component';
import { ChaListComponent } from './cha-list.component';

const routes: Routes = [
  {
    path: '',
    component: ChaListComponent,
  },
  {
    path: 'cha-form',
    component: ChaForwarderFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CHAListRoutingModule {}
