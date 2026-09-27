import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetWarrantyComponent } from './asset-warranty/asset-warranty.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { RouterModule } from '@angular/router';
import { AssetWarrantyRoutingModule } from './asset-warranty-routing.module';



@NgModule({
  declarations: [
    AssetWarrantyComponent
  ],
  imports: [
    CommonModule,
    ShairedModule,
    MaterialModule,
    AssetWarrantyRoutingModule
  ]
})
export class AssetWarrantyModule { }
