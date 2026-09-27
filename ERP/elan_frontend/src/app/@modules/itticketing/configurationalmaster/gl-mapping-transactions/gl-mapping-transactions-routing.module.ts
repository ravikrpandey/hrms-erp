import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlMappingListComponent } from './gl-mapping-list/gl-mapping-list.component';
import { AddGlMappingAccountComponent } from './add-gl-mapping-account/add-gl-mapping-account.component';

const routes: Routes = [
  {
    path:'',component:GlMappingListComponent
  },
  {
    path:'add-gl-mapping-account',component:AddGlMappingAccountComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlMappingTransactionsRoutingModule { }
