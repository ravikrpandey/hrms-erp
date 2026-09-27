import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrnRoutingModule } from './grn-routing.module';
import { GrnComponent } from './grn.component';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule, } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GrnActionComponent } from './grn-action/grn-action.component';
import { CreateGrnComponent } from './create-grn/create-grn.component';
import { GenerateGrnMultiPoComponent } from './generate-grn-multi-po/generate-grn-multi-po.component';


@NgModule({
  declarations: [
    GrnComponent,
    GrnActionComponent,
    CreateGrnComponent,
    GenerateGrnMultiPoComponent
  ],
  imports: [
    CommonModule,
    GrnRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GrnModule { }
