import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorModuleRoutingModule } from './vendor-module-routing.module';
import { VendorModuleComponent } from './vendor-module.component';
import { MaterialModule } from '../@shared/material/material.module';
import { ShairedModule } from '../@shared/shaired/shaired.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@NgModule({
  declarations: [
    VendorModuleComponent
  ],
  imports: [
    CommonModule,
    VendorModuleRoutingModule,
    ShairedModule,
    MaterialModule
  ],providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class VendorModuleModule { }
