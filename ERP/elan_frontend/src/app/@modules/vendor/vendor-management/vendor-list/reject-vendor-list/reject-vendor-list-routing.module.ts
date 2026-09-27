import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RejectVendorListComponent } from './reject-vendor-list.component';

const routes: Routes = [
   { path:'', component: RejectVendorListComponent},
  ]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RejectVendorListRoutingModule { }
