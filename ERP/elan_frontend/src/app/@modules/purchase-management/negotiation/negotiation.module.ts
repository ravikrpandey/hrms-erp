import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NegotiationRoutingModule } from './negotiation-routing.module';
import { NegotiationComponent } from './negotiation.component';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule, } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NegotiationActionComponent } from './negotiation-action/negotiation-action.component';
import { CreateNegotiationComponent } from './create-negotiation/create-negotiation.component';
import { CloseNegotiationUpdateComponent } from './close-negotiation-update/close-negotiation-update.component';
import { ReNegotiationComponent } from './re-negotiation/re-negotiation.component';


@NgModule({
  declarations: [
    NegotiationComponent,
    NegotiationActionComponent,
    CreateNegotiationComponent,
    CloseNegotiationUpdateComponent,
    ReNegotiationComponent
  ],
  imports: [
    CommonModule,
    NegotiationRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NegotiationModule { }
