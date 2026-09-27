import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendRfpComponent } from './send-rfp.component';
// import { SendRfpComponent } from './send-rfp.component';

const routes: Routes = [
  { path: "", component: SendRfpComponent, }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendRfpRoutingModule { }
