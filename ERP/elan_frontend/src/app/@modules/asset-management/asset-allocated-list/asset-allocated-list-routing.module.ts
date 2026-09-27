import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetAllocatedListComponent } from './asset-allocated-list.component';
import { AllocatedDetailsComponent } from './allocated-details/allocated-details.component';

const routes: Routes = [
  {path:'',component:AssetAllocatedListComponent},
  {path:'deallocation',component:AllocatedDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetAllocatedListRoutingModule { }
