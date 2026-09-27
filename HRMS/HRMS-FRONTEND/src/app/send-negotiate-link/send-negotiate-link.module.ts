import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SendNegotiateLinkRoutingModule } from './send-negotiate-link-routing.module';
import { SendNegotiateLinkComponent } from './send-negotiate-link.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '../@shared/material/material.module';


@NgModule({
  declarations: [
    SendNegotiateLinkComponent
  ],
  imports: [
    CommonModule,
    SendNegotiateLinkRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SendNegotiateLinkModule { }
