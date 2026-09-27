import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaceDetectionRoutingModule } from './face-detection-routing-module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { FaceDetectionCapture } from './face-detection-capture/face-detection-capture';


@NgModule({
  declarations: [
    FaceDetectionCapture
  ],
  imports: [
    CommonModule,
    FaceDetectionRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule
  ]
})
export class FaceDetectionModule { }
