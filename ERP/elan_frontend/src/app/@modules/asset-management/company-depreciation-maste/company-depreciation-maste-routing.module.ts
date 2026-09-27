import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepreciationMasterComponent } from './depreciation-master/depreciation-master.component';
import { CreateDepreciationComponent } from './create-depreciation/create-depreciation.component';

const routes: Routes = [
  {path:'',component:DepreciationMasterComponent},
  {path:'create-depreciation',component:CreateDepreciationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyDepreciationMasteRoutingModule { }
