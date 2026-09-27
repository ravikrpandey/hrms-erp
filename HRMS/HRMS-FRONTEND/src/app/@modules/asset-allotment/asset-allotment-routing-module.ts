import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetAllotmentComponent } from './asset-allotment-component/asset-allotment-component';
import { AssetAllotment } from './asset-allotment';

const routes: Routes = [
   {
      path: "", component: AssetAllotment,
      children: [
        {
          path: "asset-allotment-component",
          component: AssetAllotmentComponent
        },
      ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetAllotmentRoutingModule { }
