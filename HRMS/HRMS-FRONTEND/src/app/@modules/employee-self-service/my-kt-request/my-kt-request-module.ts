import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyKtRequestRoutingModule } from './my-kt-request-routing-module';
import { MyKtRequest } from './my-kt-request/my-kt-request';
import { AgGridModule } from 'ag-grid-angular';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    MyKtRequest
  ],
  imports: [
    CommonModule,
    MyKtRequestRoutingModule,
    AgGridModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,


  ]
})
export class MyKtRequestModule { }
