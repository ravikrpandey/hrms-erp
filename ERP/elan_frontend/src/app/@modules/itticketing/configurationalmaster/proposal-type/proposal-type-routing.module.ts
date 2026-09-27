import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposalTypeComponent } from './proposal-type.component';
import { CreateProposalComponent } from './create-proposal/create-proposal.component';

const routes: Routes = [
  { path: '', component: ProposalTypeComponent },
  { path: 'create', component: CreateProposalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalTypeRoutingModule { }
