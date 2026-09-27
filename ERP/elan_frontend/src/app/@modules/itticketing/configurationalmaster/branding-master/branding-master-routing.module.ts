import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandingMasterComponent } from './branding-master.component';
import { BrandingMasterCreateComponent } from './branding-master-create/branding-master-create.component';

const routes: Routes = [
  { path: '', component: BrandingMasterComponent },
  { path: "create-branding", component: BrandingMasterCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandingMasterRoutingModule { }
