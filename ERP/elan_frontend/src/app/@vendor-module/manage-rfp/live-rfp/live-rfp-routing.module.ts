import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveRfpComponent } from './live-rfp.component';
import { RfpDetailsComponent } from './rfp-details/rfp-details.component';

const routes: Routes = [
  {path:'',component:LiveRfpComponent},
  {path:'rfp-details',component:RfpDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveRfpRoutingModule { }
