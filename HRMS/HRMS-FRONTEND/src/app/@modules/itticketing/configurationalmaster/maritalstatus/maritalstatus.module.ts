import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaritalstatusRoutingModule } from './maritalstatus-routing.module';
import { MaritalstatusComponent } from './maritalstatus.component';


@NgModule({
  declarations: [
    MaritalstatusComponent
  ],
  imports: [
    CommonModule,
    MaritalstatusRoutingModule
  ]
})
export class MaritalstatusModule { }
