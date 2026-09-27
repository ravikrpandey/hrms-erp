import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AdditionalChargeComponent } from './additional-charge.component';
import { GstGlMappingComponent } from './gst-gl-mapping.component';

const routes: Routes = [
  {path : "", component : GstGlMappingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GstGlMappingRoutingModule { }
