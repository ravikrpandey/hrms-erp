import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';

import { aiIntegrationRoutingModule } from './ai-integration-routing.module';
import { aiIntegrationComponent } from './ai-integration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser'

@NgModule({
  declarations: [
    aiIntegrationComponent
  ],
  imports: [
    CommonModule,
    aiIntegrationRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class aiIntegrationModule { }
