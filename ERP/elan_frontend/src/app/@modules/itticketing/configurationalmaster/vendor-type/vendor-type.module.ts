import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorTypeRoutingModule } from './vendor-type-routing.module';
import { VendorActionComponent } from './vendor-action/vendor-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { VendorDilogComponent } from './vendor-dilog/vendor-dilog.component';


@NgModule({
  declarations: [
    VendorActionComponent,
    VendorDilogComponent
  ],
  imports: [
    CommonModule,
    VendorTypeRoutingModule,
    MaterialModule
  ]
})
export class VendorTypeModule { }
