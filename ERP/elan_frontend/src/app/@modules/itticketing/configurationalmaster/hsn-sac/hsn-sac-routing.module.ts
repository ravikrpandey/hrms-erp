import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HsnSacListComponent } from './hsn-sac-list/hsn-sac-list.component';
import { CreateHsnSacComponent } from './create-hsn-sac/create-hsn-sac.component';
import { HsnSacActionComponent } from './hsn-sac-action/hsn-sac-action.component';

const routes: Routes = [
  {path: '', component:HsnSacListComponent},
  {path: 'create-hsn', component: CreateHsnSacComponent},
  {path: 'hsn-action', component: HsnSacActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HsnSacRoutingModule { }
