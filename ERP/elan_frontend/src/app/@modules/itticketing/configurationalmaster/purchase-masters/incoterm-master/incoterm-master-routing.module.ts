import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncotermMasterComponent } from './incoterm-master.component';
import { IncotermMasterFormComponent } from './incoterm-master-form/incoterm-master-form.component';

const routes: Routes = [
  { path: '', component: IncotermMasterComponent },
  { path: 'create', component: IncotermMasterFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncotermMasterRoutingModule { }
