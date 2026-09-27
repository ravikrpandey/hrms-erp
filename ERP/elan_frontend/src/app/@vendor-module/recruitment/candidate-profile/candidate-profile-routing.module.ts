import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateProfileComponent } from './candidate-profile.component';
import { VendorProfileRequestComponent } from './vendor-profile-request/vendor-profile-request.component';
import { AddProfileVendorComponent } from './add-profile-vendor/add-profile-vendor.component';

const routes: Routes = [
  {path:'',component:CandidateProfileComponent},
  {path:'profile-request',component:VendorProfileRequestComponent},
  {path:'add-profile',component:AddProfileVendorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateProfileRoutingModule { }
