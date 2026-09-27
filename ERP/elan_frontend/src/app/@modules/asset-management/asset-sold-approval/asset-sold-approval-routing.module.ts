import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetSoldApprovalComponent } from './asset-sold-approval.component';

const routes: Routes = [
  {path:'',component:AssetSoldApprovalComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetSoldApprovalRoutingModule { }
