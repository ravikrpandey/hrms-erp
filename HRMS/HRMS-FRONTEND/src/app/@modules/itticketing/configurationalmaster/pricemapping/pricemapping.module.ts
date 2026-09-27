import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricemappingRoutingModule } from './pricemapping-routing.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MSAListComponent } from './msa-list/msa-list.component';
import { ActionComponent } from './action/action.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';


@NgModule({
  declarations: [
    MSAListComponent,
    ActionComponent
  ],
  providers: [ConfigurationalmasterService],
  imports: [
    CommonModule,
    PricemappingRoutingModule,
    MaterialModule
  ]
})
export class PricemappingModule { }
