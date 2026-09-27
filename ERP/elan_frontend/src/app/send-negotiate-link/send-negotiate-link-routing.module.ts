import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendNegotiateLinkComponent } from './send-negotiate-link.component';

const routes: Routes = [
  {path:'',component:SendNegotiateLinkComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendNegotiateLinkRoutingModule { }
