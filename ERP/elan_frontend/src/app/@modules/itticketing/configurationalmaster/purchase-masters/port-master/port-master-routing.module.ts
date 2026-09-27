import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortMasterComponent } from './port-master.component';
import { PortMasterFormComponent } from './port-master-form/port-master-form.component';

const routes: Routes = [
  { path: '', component: PortMasterComponent },
  { path: 'create', component: PortMasterFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortMasterRoutingModule { }
