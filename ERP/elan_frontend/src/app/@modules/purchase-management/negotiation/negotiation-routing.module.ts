import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NegotiationComponent } from './negotiation.component';
import { CreateNegotiationComponent } from './create-negotiation/create-negotiation.component';
import { CloseNegotiationUpdateComponent } from './close-negotiation-update/close-negotiation-update.component';
import { ReNegotiationComponent } from './re-negotiation/re-negotiation.component';

const routes: Routes = [
  { path: '', component: NegotiationComponent },
  { path: 'create-negotiation', component: CreateNegotiationComponent },
  { path: 'create-negotiation-quotation', component: CloseNegotiationUpdateComponent },
  { path: 're-negotiation', component: ReNegotiationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NegotiationRoutingModule { }
