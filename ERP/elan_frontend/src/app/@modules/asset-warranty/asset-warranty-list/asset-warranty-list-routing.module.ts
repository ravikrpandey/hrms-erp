import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarrantyListComponent } from './warranty-list/warranty-list.component';
import { AddWarrantyComponent } from './add-warranty/add-warranty.component';

const routes: Routes = [
  {path:'',component:WarrantyListComponent},
  {path:'add-warranty',component:AddWarrantyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetWarrantyListRoutingModule { }
