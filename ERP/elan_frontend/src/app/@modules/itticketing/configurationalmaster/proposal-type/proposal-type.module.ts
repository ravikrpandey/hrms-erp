import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProposalTypeRoutingModule } from './proposal-type-routing.module';
import { ProposalTypeComponent } from './proposal-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CreateProposalComponent } from './create-proposal/create-proposal.component';
import { ProposalActionComponent } from './proposal-action/proposal-action.component';

@NgModule({
  declarations: [ProposalTypeComponent, CreateProposalComponent, ProposalActionComponent],
  imports: [
    CommonModule,
    ProposalTypeRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ProposalTypeModule {}
