import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetWriteOffApprovalComponent } from './asset-write-off-approval.component';

const routes: Routes = [
   {path:'',component:AssetWriteOffApprovalComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetWriteOffApprovalRoutingModule { }
